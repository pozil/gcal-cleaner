import { LightningElement, api, track } from 'lwc';

export default class EventList extends LightningElement {
    @track _events;

    @api
    set events(value) {
        this._events = value ? value.map((e) => ({ ...e })) : undefined;
    }
    get events() {
        return this._events;
    }

    handleEventCheckboxChange(event) {
        const eventId = event.target.dataset.id;
        const calEvent = this._events.find((item) => item.id === eventId);
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
        const eventIds = selectedEvents.map((event) => event.id);
        const deleteEvent = new CustomEvent('delete', {
            detail: {
                eventIds
            }
        });
        this.dispatchEvent(deleteEvent);
    }

    toggleEventSelection(isSelected) {
        this._events = this._events.map((item) => {
            const updatedItem = item;
            updatedItem.selected = isSelected;
            return updatedItem;
        });
    }

    getSelectedEvents() {
        if (this.isLoading) return [];
        return this._events.filter((item) => item.selected);
    }

    get eventCount() {
        return this.isLoading ? '-' : this._events.length;
    }

    get selectedCount() {
        return this.getSelectedEvents().length;
    }

    get hasNoSelection() {
        return this.getSelectedEvents().length === 0;
    }

    get isLoading() {
        return this._events === undefined;
    }
}
