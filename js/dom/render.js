var domEvents = require('../domEvents');
var addMonths = require('../addMonths');
var cloneDate = require('../cloneDate');
var properties = require('../properties');
var isLowerMonthThan = require('../isLowerMonthThan');
var isHigherMonthThan = require('../isHigherMonthThan');
var isSameMonth = require('../isSameMonth');

var dateSwitchEl = require('./dateSwitchEl');
var weekDaysEl = require('./weekDaysEl');
var monthEl = require('./monthEl');
var months = require('./months');

var emptyElement = require('./emptyElement');

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

    this.weekDays = new weekDaysEl(this.props);
    this.el.appendChild(this.weekDays.getEl());


    this.slidesEl = document.createElement('div');
    this.slidesEl.className = 'calendar__slides';
    this.el.appendChild(this.slidesEl);

    // Slide elements
    this.slideEls = [];

    for (var si = 0; si < 10; si++) {
        var sel = document.createElement('div');
        sel.className = 'calendar__slide';
        this.slidesEl.appendChild(sel);
        this.slideEls.push(sel);
    }
    

    // Mēnešu elementu kolekcija
    this.months = new months();

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
                mthis.handleMonthDayClick(day)
            }
            else if (mthis.dateSwitch.isNavPrev(t)) {

                mthis.infty.prevSlide();

                mthis.fire('prevclick', []);
            }
            else if (mthis.dateSwitch.isNavNext(t)) {

                mthis.infty.nextSlide();

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

        this.infty.onChange(function(){
            mthis.handleSlideChange();
        })

        this.infty.onSlideAdd(function(index, el){
            mthis.handleSlideAdd(index, el)
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
        var mthis = this;
        
        this.date = cloneDate(date);
        this.dateSwitch.setDate(date);

        // Jānomaina datums (tikai date daļa) visos kalendāros
        this.months.each(function(month){
            month.changeMonthDate(mthis.date.getDate())
        })
    },

    getMonthByYearMonth: function(year, month) {
        return this.months.findByYearMonth(year, month);
    },

    handleMonthDayClick: function(day) {
        var mthis = this;

        // Pārbaudām vai vajag pārslēgties uz prev/next mēnesi
        if (!isSameMonth(this.date, day.date)) {
            if (isLowerMonthThan(day.date, this.date)) {
                setTimeout(function(){
                    mthis.infty.prevSlide();
                }, 2)
            }
            else if (isHigherMonthThan(day.date, this.date)) {
                setTimeout(function(){
                    mthis.infty.nextSlide();
                }, 2)
            }
        }

        this.setDate(day.date);

        this.fire('dateclick', [day.date]);
    },

    handleSlideAdd: function(index, el) {
        // Pārbaudām vai slide elementā jau ir mēneša elements
        var month = this.months.findMonthByConainer(el);

        if (!month) {
            month = this.months.push(new monthEl(addMonths(this.inftySlidesDate, index), this.props));
        }
        else {
            month.setDate(addMonths(this.inftySlidesDate, index))
        }

        emptyElement(el).appendChild(month.el);
    },

    handleSlideChange: function() {
        var current = this.infty.getCurrent();
        var month = this.months.findMonthByConainer(current.el);

        this.setDate(month.getDate())
    },

    initInfinitySwipe: function() {
        /**
         * Šis datums tiks izmantots, lai uzstādītu slaidos datumu
         * Slaidiem ir offset no pirmā slide. Šim datuma tiks likts klāt
         * slaida offset kā mēnesis un tādā veidā zināšu 
         * kādu mēnesi renderēt attiecīgajā slaidā. 
         * Šim datumam nekad nevajadzētu mainīties gadam un mēnesim.
         * Datuma daļa (dd) var mainīties atkarībā no izvēlētā
         */
        this.inftySlidesDate = cloneDate(this.date);
        this.infty = new infinityswipe(this.slidesEl, this.slideEls, {
            positionItems: true
        })
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