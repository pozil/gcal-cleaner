module.exports = class Configuration {
    static isValid() {
        return (
            process.env.GOOGLE_CLIENT_ID &&
            process.env.GOOGLE_CLIENT_SECRET &&
            process.env.GOOGLE_AUTH_REDIRECT_URL &&
            process.env.SESSION_SECRET_KEY
        );
    }

    static getGoogleClientId() {
        return process.env.GOOGLE_CLIENT_ID;
    }

    static getGoogleClientSecret() {
        return process.env.GOOGLE_CLIENT_SECRET;
    }

    static getGoogleAuthRedirectUrl() {
        return process.env.GOOGLE_AUTH_REDIRECT_URL;
    }

    static getSessionSecretKey() {
        return process.env.SESSION_SECRET_KEY;
    }

    static isHttps() {
        return !(
            process.env.IS_HTTPS &&
            process.env.IS_HTTPS.toLowerCase() === 'false'
        );
    }
};
