const express = require('express'),
    helmet = require('helmet'),
    compression = require('compression'),
    session = require('express-session'),
    path = require('path'),
    Configuration = require('./utils/configuration.js'),
    AuthRestResource = require('./rest/auth.js'),
    EventRestResource = require('./rest/events.js'),
    ConfigRestResource = require('./rest/config.js');

// Load and check config
require('dotenv').config();
if (!Configuration.isValid()) {
    console.error(
        'Cannot start app: missing mandatory configuration. Check your .env file.'
    );
    process.exit(-1);
}

// Configure and start express
const app = express();
app.use(
    helmet({
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'img-src': ["'self'", 'lh3.googleusercontent.com']
            }
        }
    })
);
app.use(compression());
app.use(express.json());
app.use(
    session({
        secret: Configuration.getSessionSecretKey(),
        cookie: { secure: process.env.isHttps === 'true' },
        resave: false,
        saveUninitialized: false
    })
);

// Serve HTML pages under dist directory
app.use('/', express.static(path.join(__dirname, '../../dist')));

// Setup auth REST resources
const authRest = new AuthRestResource();
app.get('/auth/login', (request, response) => {
    authRest.login(request, response);
});
app.get('/auth/callback', (request, response) => {
    authRest.loginCallback(request, response);
});
app.get('/auth/logout', (request, response) => {
    authRest.logout(request, response);
});
app.get('/auth/user', (request, response) => {
    authRest.getLoggedUser(request, response);
});

/**
 * Setup events REST resources
 */
const eventRest = new EventRestResource();
app.get('/api/events', (request, response) => {
    eventRest.search(request, response);
});
app.delete('/api/events', (request, response) => {
    eventRest.delete(request, response);
});

/**
 * Config REST resources
 */
const configRest = new ConfigRestResource();
app.get('/api/config', (request, response) => {
    configRest.getConfig(request, response);
});

// HTTP Listen
const HOST = process.env.API_HOST || 'localhost';
const PORT = process.env.API_PORT || 3002;
app.listen(PORT, () =>
    console.log(`✅  Server started: http://${HOST}:${PORT}`)
);
