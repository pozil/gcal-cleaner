'use strict';

import { defineConfig } from 'eslint/config';
import eslintJs from '@eslint/js';
import salesforceLwcConfig from '@salesforce/eslint-config-lwc/recommended.js';
import globals from 'globals';

export default defineConfig([
    // Global ignores
    {
        ignores: ['__lwr_cache__']
    },

    // LWC configuration
    {
        files: ['src/client/**/*.js'],
        extends: [salesforceLwcConfig],
        rules: {
            '@lwc/lwc/no-async-operation': 'off',
            '@lwc/lwc/no-unknown-wire-adapters': 'off',
            '@lwc/lwc/no-inner-html': 'warn',
            '@lwc/lwc/no-document-query': 'warn'
        }
    },

    // Node configuration
    {
        files: [
            'src/server/**/*.js',
            'scripts/**/*.js',
            'jest.config.js',
            'lwc-services.config.js'
        ],
        languageOptions: {
            globals: {
                ...globals.node
            }
        },
        plugins: {
            eslintJs
        },
        extends: ['eslintJs/recommended']
    }
]);
