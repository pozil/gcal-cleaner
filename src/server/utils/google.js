const https = require('https'),
    { google } = require('googleapis'),
    Configuration = require('./configuration.js');

module.exports = class GoogleService {
    constructor() {
        this._client = GoogleService._getOAuthClient();
    }

    /**
     *  Attemps to retrieve service from the server session.
     *  If there is no session returns null
     *  If there is no session and redirectWithError is true, redirects with HTTP 401 and an error message
     */
    static loadFromSession(request, response, redirectWithError = true) {
        if (!request.session.googleAuthTokens) {
            if (redirectWithError) {
                response.status(401).send('No active session');
            }
            return null;
        }
        const service = new GoogleService();
        service._client.setCredentials(request.session.googleAuthTokens);
        return service;
    }

    static _getOAuthClient() {
        // Configure Google OAuth client
        const oauth2Client = new google.auth.OAuth2(
            Configuration.getGoogleClientId(),
            Configuration.getGoogleClientSecret(),
            Configuration.getGoogleAuthRedirectUrl()
        );
        google.options({
            auth: oauth2Client
        });
        return oauth2Client;
    }

    getCalendarService() {
        if (!this._calendar) {
            this._calendar = google.calendar({
                version: 'v3',
                oauth2Client: this._client
            });
        }
        return this._calendar;
    }

    getAuthUrl() {
        return this._client.generateAuthUrl({
            scope: [
                'https://www.googleapis.com/auth/calendar',
                'https://www.googleapis.com/auth/userinfo.email',
                'https://www.googleapis.com/auth/userinfo.profile'
            ]
        });
    }

    /**
     * Gets user info {"id":"114295724767154173919","email":"philippe.ozil@gmail.com","verified_email":true,"name":"Philippe Ozil","given_name":"Philippe","family_name":"Ozil","picture":"https://lh3.googleusercontent.com/a-/AOh14GjLD1tQpeSddU_YhND9TrigAmCFozNaTjM0WDBqxg","locale":"en"}
     */
    async getUserInfo() {
        const oauth2 = google.oauth2({
            version: 'v2'
        });
        const response = await oauth2.userinfo.get({});
        return response.data;
    }

    static async login(session, authCode) {
        // Build auth tokens from auth code and store it in server session (never expose it directly to client)
        const service = new GoogleService();
        const { tokens } = await service._client.getToken(authCode);
        session.googleAuthTokens = tokens;
    }

    static logout(session) {
        return new Promise((resolve, reject) => {
            // Resolve request if there's no session
            if (!session.googleAuthTokens) {
                resolve();
                return;
            }

            // Revoke OAuth token
            const revokeTokenUrl = `https://accounts.google.com/o/oauth2/revoke?token=${session.googleAuthTokens.access_token}`;
            https.get(revokeTokenUrl, (res) => {
                if (res.statusCode === 200) {
                    // Destroy server-side session
                    session.destroy((err) => {
                        if (err) {
                            const errorMessage = `Session destruction error: HTTP ${JSON.stringify(
                                err
                            )}`;
                            console.error(errorMessage);
                            reject(errorMessage);
                        } else {
                            resolve();
                        }
                    });
                } else {
                    const err = `Failed to revoke Google Auth token: HTTP ${res.statusCode}`;
                    console.error(err);
                    reject(err);
                }
            });
        });
    }
};
