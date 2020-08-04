import { register, ValueChangedEvent } from '@lwc/wire-service';
import { fetchJson } from 'utils/fetch';

const EVENTS_REST_URL = '/api/events';

export function deleteEvents(ids) {
    return fetch(EVENTS_REST_URL, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
    });
}

export function getEvents(config) {
    return new Promise((resolve, reject) => {
        const observer = {
            next: (data) => resolve(data),
            error: (error) => reject(error)
        };
        getData(config, observer);
    });
}

function getData(config, observer) {
    const searchTerm = config && config.searchTerm ? config.searchTerm : '';
    fetch(`${EVENTS_REST_URL}?q=${searchTerm}`, {
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

register(getEvents, (eventTarget) => {
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
