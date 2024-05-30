export class TransformerNode {
    constructor (markerId) {
        this.markerId = markerId;
        this.connections = 0;
        this.highBus = null;
        this.lowBus = null;
    }

    connectBus(id) {
        if (this.connections === 2) {
            return false;
        } else if (this.connections === 1) {
            this.lowBus = id;
            connections += 1;
        } else {
            this.highBus = id;
            connections += 1;
        }

        return true;
    }

    

}