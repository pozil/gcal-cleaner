import { fetchJson } from 'utils/fetch';

export async function getConfig() {
    const data = await fetchJson('/api/config');
    return data;
}
