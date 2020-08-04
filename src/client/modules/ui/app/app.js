import { LightningElement, wire } from 'lwc';
import { getLogedUser } from 'services/user';

export default class App extends LightningElement {
    isLoading = true;
    user;

    @wire(getLogedUser)
    getLogedUser({ error, data }) {
        if (data) {
            this.user = data;
        } else if (error) {
            console.error(error);
        }
        this.isLoading = false;
    }
}
