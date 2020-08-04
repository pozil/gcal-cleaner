import { LightningElement, track, wire } from 'lwc';
import { getEvents, deleteEvents } from 'services/events';

export default class EventList extends LightningElement {
    isLoading = true;
    @track events = [];
    searchTerm = '';

    @wire(getEvents, { searchTerm: '$searchTerm' })
    getEvents({ error, data }) {
        if (data) {
            this.events = data;
            this.isLoading = false;
        } else if (error) {
            console.error(error);
            this.isLoading = false;
        }
    }

    handleSearchTermChange(event) {
        this.searchTerm = event.target.value;
        this.events = [];
        this.isLoading = true;
    }

    handleEventCheckboxChange(event) {
        const eventId = event.target.dataset.id;
        const calEvent = this.events.find((item) => item.id === eventId);
        calEvent.selected = !calEvent.selected;
    }

    handleSelectAllClick() {
        this.toggleEventSelection(true);
    }

    handleSelectNoneClick() {
        this.toggleEventSelection(false);
    }

    handleDeleteClick() {
        const selectedEvents = this.getSelectedEvents();
        const deletedEventIds = selectedEvents.map((event) => event.id);
        deleteEvents(deletedEventIds)
            .then(() => {
                this.events = this.events.filter((item) => {
                    const foundIndex = deletedEventIds.indexOf(item.id);
                    if (foundIndex === -1) {
                        return true;
                    }
                    deletedEventIds.splice(foundIndex, 1);
                    return false;
                });
            })
            .catch((err) => {
                console.error('Failed to delete events', err);
            });
    }

    toggleEventSelection(isSelected) {
        this.events = this.events.map((item) => {
            const updatedItem = item;
            updatedItem.selected = isSelected;
            return updatedItem;
        });
    }

    getSelectedEvents() {
        return this.events.filter((item) => item.selected);
    }

    get selectedCount() {
        return this.getSelectedEvents().length;
    }

    get hasNoSelection() {
        return this.getSelectedEvents().length === 0;
    }
}
