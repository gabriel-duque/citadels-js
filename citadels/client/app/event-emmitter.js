export default new class EventEmitter {

    constructor() {
        this.events = {};
    }

    on(event, callback) {
        if (!this.events[event]) {
            this.events[event] = [];
        }

        this.events[event].push(callback);
    }

    emit(event, ...args) {
        
        if (this.events[event]) {
            this.events[event].forEach(callback => {
                callback(...args);
            });
        }

        return this;
    }

    off(event, callback) {

        if (this.events[event]) {
            this.events[event] = this.events[event].filter(cb => cb !== callback);
        }
        
        return this;
    }

    removeAllListeners(event) {
        this.events[event] = [];
    }
}