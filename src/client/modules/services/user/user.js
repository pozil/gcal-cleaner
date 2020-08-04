import { register, ValueChangedEvent } from '@lwc/wire-service';
import { fetchJson } from 'utils/fetch';

export function getLogedUser(config) {
    return new Promise((resolve, reject) => {
        const observer = {
            next: (data) => resolve(data),
            error: (error) => reject(error)
        };
        getData(config, observer);
    });
}

function getData(config, observer) {
    fetch('/auth/user', {
        headers: {
            pragma: 'no-cache',
            'Cache-Control': 'no-cache'
        }
    })
        .then(fetchJson)
        .then((jsonResponse) => {
            observer.next(jsonResponse);
        })
        .catch((error) => {
            observer.error(error);
        });
}

register(getLogedUser, (eventTarget) => {
    let config;
    eventTarget.dispatchEvent(
        new ValueChangedEvent({ data: undefined, error: undefined })
    );

    const observer = {
        next: (data) =>
            eventTarget.dispatchEvent(
                new ValueChangedEvent({ data, error: undefined })
            ),
        error: (error) =>
            eventTarget.dispatchEvent(
                new ValueChangedEvent({ data: undefined, error })
            )
    };

    eventTarget.addEventListener('config', (newConfig) => {
        config = newConfig;
        getData(config, observer);
    });
});
