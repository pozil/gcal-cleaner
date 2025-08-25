import Configuration from '../utils/configuration.js';

export default class ConfigRestResource {
    /**
     * Get config
     */
    async getConfig(request, response) {
        const config = {
            spamKeywords: Configuration.getSpamKeywords()
        };
        response.send(config);
    }
}
