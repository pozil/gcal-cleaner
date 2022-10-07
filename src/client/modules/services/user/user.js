import { fetchJson } from 'utils/fetch';

export async function getLogedUser() {
    const data = await fetchJson('/auth/user', {
        headers: {
            pragma: 'no-cache',
            'Cache-Control': 'no-cache'
        }
    });
    return data;
}
