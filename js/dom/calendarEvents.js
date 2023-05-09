function CalendarEvents(eventNames) {
    this.events = this.prepareEvents(eventNames);
}

CalendarEvents.prototype = {
    prepareEvents(eventNames) {
        var r = {};
        for (let i in eventNames) {
            r[eventNames[i]] = [];
        }
        return r;
    },

    on(eventName, cb) {
        if (typeof this.events[eventName] != 'undefined') {
            this.events[eventName].push(cb);
        }

        return this;
    },

    fire(eventName, args) {
        for (var i in this.events[eventName]) {
            this.events[eventName][i].apply(this, args);
        }
    },
}

export default CalendarEvents;