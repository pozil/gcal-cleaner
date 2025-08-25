import 'dotenv/config';
import express from 'express';
import helmet from 'helmet';
import compression from 'compression';
import session from 'express-session';
import { createServer } from 'lwr';
import Configuration from './utils/configuration.js';
import AuthRestResource from './api/auth.js';
import EventRestResource from './api/events.js';
import ConfigRestResource from './api/config.js';

async function start() {
    // Load and check config
    if (!Configuration.isValid()) {
        console.error(
            'Cannot start app: missing mandatory configuration. Check your .env file.'
        );
        process.exit(-1);
    }

    // Configure server
    const lwrServer = createServer();
    const app = lwrServer.getInternalServer();

    const serverMode = process.env.MODE || 'dev';
    const helmetOptions = {
        contentSecurityPolicy: {
            directives: {
                ...helmet.contentSecurityPolicy.getDefaultDirectives(),
                'img-src': ["'self'", 'lh3.googleusercontent.com'],
                'script-src': ["'self'", "'unsafe-inline'"]
            }
        }
    };
    if (serverMode === 'dev') {
        helmetOptions.contentSecurityPolicy.directives[
            'upgrade-insecure-requests'
        ] = null;
        helmetOptions.strictTransportSecurity = false;
    }
    app.use(helmet(helmetOptions));
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
    lwrServer
        .listen(({ port, serverMode }) => {
            console.log(
                `App listening on port ${port} in ${serverMode} mode\n`
            );
        })
        .catch((err) => {
            console.error(err);
            process.exit(1);
        });
}

start();
