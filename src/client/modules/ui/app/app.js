import { LightningElement } from 'lwc';
import { getLogedUser } from 'services/user';
import { getEvents, deleteEvents } from 'services/events';
import { getConfig } from 'services/config';

export default class App extends LightningElement {
    user;
    config;
    isLoading = true;
    searchTerm = '';
    events;
    spamEvents;

    async connectedCallback() {
        try {
            [this.user, this.config] = await Promise.all([
                getLogedUser(),
                getConfig()
            ]);
        } catch (error) {
            console.error(error);
        } finally {
            this.isLoading = false;
        }
        try {
            await this.loadEvents('');
        } catch (error) {
            console.error(error);
        }
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
    }

    async handleSearch(event) {
        event.preventDefault();
        this.loadEvents(this.searchTerm);
    }

    async loadEvents(searchTerm) {
        this.events = undefined;
        this.spamEvents = undefined;
        try {
            this.events = await getEvents(searchTerm);
            this.filterSpam();
        } catch (error) {
            console.error(error);
        }
    }

    filterSpam() {
        const spamEvents = [];
        this.events.forEach((event) => {
            const { summary } = event;
            let isSpam = false;
            for (
                let i = 0;
                !isSpam && i < this.config.spamKeywords.length;
                i++
            ) {
                isSpam = summary.indexOf(this.config.spamKeywords[i]) !== -1;
            }
            if (isSpam) {
                spamEvents.push(event);
            }
        });
        this.spamEvents = spamEvents;
    }

    async handleDeleteEvents(event) {
        const { eventIds } = event.detail;
        try {
            await deleteEvents(eventIds);
            this.events = this.events.filter((item) => {
                const foundIndex = eventIds.indexOf(item.id);
                if (foundIndex === -1) {
                    return true;
                }
                eventIds.splice(foundIndex, 1);
                return false;
            });
            this.filterSpam();
        } catch (err) {
            console.error('Failed to delete events', err);
        }
    }
}
