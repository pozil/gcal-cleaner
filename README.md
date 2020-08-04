# Google Calendar Cleaner

This app helps you mass delete events from your Google Calendar.
The app use OAuth 2.0 to connect to Google.

## Installation

1. Create a `.env` file with this format at the root of the project:

    ```
    GOOGLE_CLIENT_ID=
    GOOGLE_CLIENT_SECRET=
    GOOGLE_AUTH_REDIRECT_URL=
    SESSION_SECRET_KEY=
    IS_HTTPS=false
    ```

1. Update the `.env` values based on your settings:

    | Variable                   | Description                                                                                                                                        |
    | -------------------------- | -------------------------------------------------------------------------------------------------------------------------------------------------- |
    | `GOOGLE_CLIENT_ID`         | Your Google client id.                                                                                                                             |
    | `GOOGLE_CLIENT_SECRET`     | Your Google client secret.                                                                                                                         |
    | `GOOGLE_AUTH_REDIRECT_URL` | The URL used by Google to perform the OAuth 2.0 callback on this app. For example, if running on local host: `http://localhost:3002/auth/callback` |
    | `SESSION_SECRET_KEY`       | Your session secret key (a random hash used to keep safe your server session)                                                                      |
    | `IS_HTTPS`                 | Whether the app is exposed via HTTPS (`true` or `false`)                                                                                           |

1. Start the app with `npm start`
