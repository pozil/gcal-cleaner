import { fetchJson } from 'utils/fetch';

const EVENTS_REST_URL = '/api/events';

export async function deleteEvents(ids) {
    return fetchJson(EVENTS_REST_URL, {
        method: 'delete',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ ids })
    });
}

export async function getEvents(searchTerm) {
    const data = await fetchJson(`${EVENTS_REST_URL}?q=${searchTerm}`, {
        headers: {
            pragma: 'no-cache',
            'Cache-Control': 'no-cache'
        }
    });
    return data;
}
