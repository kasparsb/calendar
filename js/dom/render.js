var domEvents = require('../domEvents');
var addMonths = require('../addMonths');
var cloneDate = require('../cloneDate');
var properties = require('../properties');

var dateSwitchEl = require('./dateSwitchEl');
var monthEl = require('./monthEl');
var months = require('./months');

var collection = require('./jQueryCollection');

var infinityswipe = require('infinityswipe');


function render(date, props) {
    var mthis = this;

    this.events = this.prepareEvents([
        'dateclick', 'prevclick', 'nextclick', 'datecaptionclick'
    ]);

    this.props = new properties(props);

    this.date = cloneDate(date);

    this.el = document.createElement('div');
    this.el.className = 'calendar';

    
    this.dateSwitch = new dateSwitchEl(this.date, this.props);
    this.el.appendChild(this.dateSwitch.getEl());


    this.slidesEl = document.createElement('div');
    this.slidesEl.className = 'calendar__slides';
    this.el.appendChild(this.slidesEl);

    // Slide elements
    this.slideEls = new collection();

    for (var si = 0; si < 5; si++) {
        var sel = document.createElement('div');
        sel.className = 'calendar__slide';
        this.slidesEl.appendChild(sel);
        this.slideEls.push(sel);
    }
    


    this.months = new months();

    // this.months.push(new monthEl(this.date, this.props));
    // this.months.push(new monthEl(addMonths(this.date, 1), this.props));
    // // Append each month el
    // this.months.each(function(month){
    //     mthis.el.appendChild(month.el);
    // })

    this.initInfinitySwipe();

    this.setEvents('add');
}

render.prototype = {
    setEvents: function(mode) {

        var mthis = this;
        function click(ev) {

            var t = domEvents.eventTarget(ev);
            
            var day = mthis.months.findDayByEl(t);
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


        this.infty.onSlideAdd(function(index, el){
            //console.log(index, el);

            var m = new monthEl(addMonths(mthis.date, index), mthis.props);
            mthis.months.push(m);
            
            el.appendChild(m.el);
            
        });
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
        this.dateSwitch.setDate(date);

        var s = 0;
        this.months.each(function(month){

            if (s == 0) {
                month.setDate(date);
            }
            else {
                month.setDate(addMonths(date, s));
            }
            

            s++;
        })
    },

    initInfinitySwipe: function() {
        this.infty = new infinityswipe(this.slidesEl, this.slideEls)

        this.infty.onSlideAdd(function(index, el){
            console.log(index, el);
        });
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