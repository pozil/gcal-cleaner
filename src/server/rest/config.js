const Configuration = require('../utils/configuration');

module.exports = class ConfigRestResource {
    /**
     * Get config
     */
    async getConfig(request, response) {
        const config = {
            spamKeywords: Configuration.getSpamKeywords()
        };
        response.send(config);
    }
};
