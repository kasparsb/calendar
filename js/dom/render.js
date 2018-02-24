var domEvents = require('../domEvents');
var addMonths = require('../addMonths');
var cloneDate = require('../cloneDate');
var properties = require('../properties');

var dateSwitchEl = require('./dateSwitchEl');
var monthEl = require('./monthEl');


function render(date, props) {
    this.events = this.prepareEvents([
        'dateclick', 'prevclick', 'nextclick', 'datecaptionclick'
    ]);

    this.props = new properties(props);

    this.date = cloneDate(date);

    this.el = document.createElement('div');

    this.el.className = 'calendar';

    this.dateSwitch = new dateSwitchEl(this.date, this.props);
    this.month = new monthEl(this.date, this.props);

    this.el.appendChild(this.dateSwitch.getEl());
    this.el.appendChild(this.month.el);

    this.setEvents('add');
}

render.prototype = {
    setEvents: function(mode) {

        var mthis = this;
        function click(ev) {

            var t = domEvents.eventTarget(ev);
            
            var day = mthis.month.findDayByEl(t);
            if (day) {

                mthis.setDate(day.date);

                mthis.fire('dateclick', [day.date]);
            }
            else if (mthis.dateSwitch.isNavPrev(t)) {

                mthis.setDate(addMonths(mthis.date, -1));

                mthis.fire('prevclick', []);
            }
            else if (mthis.dateSwitch.isNavNext(t)) {

                mthis.setDate(addMonths(mthis.date, 1));

                mthis.fire('nextclick', []);
            }
            else if (mthis.dateSwitch.isDateCaption(t)) {
                mthis.fire('datecaptionclick', []);
            }
        }

        /**
         * @todo Pārtaisīt uz external funkciju, pretējā gadījumā nevar novākt listener
         */
        if (mode == 'add') {
            domEvents.addEvent(this.el, 'click', click)
        }
        else {
            domEvents.removeEvent(this.el, 'click', click);
        }
    },

    prepareEvents: function(eventNames) {
        var r = {};
        for ( var i in eventNames ) {
            r[eventNames[i]] = [];
        }
        return r;
    },

    on: function(eventName, cb) {
        if (typeof this.events[eventName] != 'undefined') {
            this.events[eventName].push(cb);
        }

        return this;
    },

    /**
     * Fire events attached callbacks
     */
    fire: function(eventName, args) {
        console.log('fire', eventName, args)
        for (var i in this.events[eventName]) {
            this.events[eventName][i].apply(this, args);
        }
    },

    getEl: function() {
        return this.el;
    },

    /**
     * Uzstādām jaunu datumu
     */
    setDate: function(date) {
        this.date = cloneDate(date);
        this.dateSwitch.setDate(date)
        this.month.setDate(date)
    },

    destroy: function() {
        this.setEvents('remove');

        if (this.el) {
            this.el.parentNode.removeChild(this.el);
            delete this.el;
        }
    }
}

module.exports = render;