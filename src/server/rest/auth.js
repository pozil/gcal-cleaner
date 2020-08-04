const GoogleService = require('../utils/google.js');

module.exports = class AuthRestResource {
    /**
     * Login endpoint
     */
    login(request, response) {
        // Redirect to Google authorization page
        const googleService = new GoogleService();
        response.redirect(googleService.getAuthUrl());
    }

    /**
     * Login callback endpoint (only called by Google)
     */
    async loginCallback(request, response) {
        // Check for auth code in query
        const authCode = request.query.code;
        if (!authCode) {
            response
                .status(500)
                .send('Failed to get authorization code from server callback.');
            return;
        }
        // Save credentials in session
        await GoogleService.login(request.session, authCode);
        // Redirect to app main page
        response.redirect('/index.html');
    }

    /**
     * Logout endpoint
     */
    async logout(request, response) {
        await GoogleService.logout(request.session);
        // Redirect to app main page
        response.redirect('/index.html');
    }

    /**
     * Returns the logged user information or null if there is no active session
     */
    async getLoggedUser(request, response) {
        const google = GoogleService.loadFromSession(request, response, false);
        if (!google) {
            response.send(null);
            return;
        }

        try {
            const userInfo = await google.getUserInfo();
            response.send(userInfo);
        } catch (err) {
            console.error(err);
            response.status(500).send('Failed to get user information.');
        }
    }
};
