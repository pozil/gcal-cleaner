const GoogleService = require('../utils/google.js');

const formatEventDate = (eventBoundary) => {
    if (eventBoundary.date) {
        return eventBoundary.date;
    }
    return eventBoundary.dateTime
        .replace('T', ' ')
        .replace(/\+[0-9]{2}:[0-9]{2}/, '');
};

const PAGE_SIZE = 2;

module.exports = class EventRestResource {
    /**
     * Search endpoint
     */
    async search(request, response) {
        // Load calendar service
        const google = GoogleService.loadFromSession(request, response);
        if (!google) {
            return;
        }
        const calendar = google.getCalendarService();

        // Get query filter
        const { q } = request.query;

        // Query events
        try {
            const result = await calendar.events.list({
                calendarId: 'primary',
                timeMin: new Date().toISOString(),
                singleEvents: true,
                orderBy: 'startTime',
                q
            });

            // Simplify event data
            const events = result.data.items.map((rawEvent) => {
                return {
                    id: rawEvent.id,
                    summary: rawEvent.summary,
                    start: formatEventDate(rawEvent.start),
                    end: formatEventDate(rawEvent.end)
                };
            });
            response.send(events);
        } catch (err) {
            const message = 'Failed to retrieve event list';
            console.error(message, err);
            response.status(500).send(message);
        }
    }

    async delete(request, response) {
        // Load calendar service
        const google = GoogleService.loadFromSession(request, response);
        if (!google) {
            return;
        }
        const calendar = google.getCalendarService();

        // Get target event id
        let { ids } = request.body;
        if (!ids) {
            response.status(500).send('Missing event ids');
            return;
        }
        console.log(`Deleting ${ids.length} event(s): ${ids}`);

        try {
            while (ids.length > 0) {
                const pagedIds = [];
                for (; pagedIds.length < PAGE_SIZE && ids.length > 0; ) {
                    pagedIds.push(ids.pop());
                }
                // eslint-disable-next-line no-await-in-loop
                await Promise.all(
                    pagedIds.map((pagedId) => {
                        return calendar.events.delete({
                            calendarId: 'primary',
                            eventId: pagedId
                        });
                    })
                );
            }
            response.status(200).send();
        } catch (err) {
            const message = `Failed to delete some events from the list: ${ids}`;
            console.error(message, err);
            response.status(500).send(message);
        }
    }
};
