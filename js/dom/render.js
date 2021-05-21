var domEvents = require('../domEvents');
var addMonths = require('../addMonths');
var cloneDate = require('../cloneDate');
var properties = require('../properties');
var isLowerMonthThan = require('../isLowerMonthThan');
var isHigherMonthThan = require('../isHigherMonthThan');
var isSameDate = require('../isSameDate');
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
        'dateclick',

        // Pogas next un prev click
        'prevclick',
        'nextclick',

        'datecaptionclick',

        // Ja maina mēnesi ar swipe kustību, tad izpildās tikai šis
        'slidechange',

        // Visu ielādēto slide events
        'slideschange'
    ]);

    this.props = new properties(props);

    this.cssPrefix = this.props.get('cssPrefix', '');

    this.date = cloneDate(date);
    // Pēc noklusējuma datums nav highlite
    this.highliteDate = null;

    this.el = document.createElement('div');
    this.el.className = this.cssPrefix+'calendar';


    this.dateSwitch = new dateSwitchEl(this.date, this.props);
    this.el.appendChild(this.dateSwitch.getEl());

    this.weekDays = new weekDaysEl(this.props);
    this.el.appendChild(this.weekDays.getEl());


    this.slidesEl = document.createElement('div');
    this.slidesEl.className = this.cssPrefix+'calendar__slides';
    this.el.appendChild(this.slidesEl);

    // Slide elements
    this.slideEls = [];

    for (var si = 0; si < 5; si++) {
        var sel = document.createElement('div');
        sel.className = this.cssPrefix+'calendar__slide';
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

        this.infty.onSlideAdd(function(index, el, slide){
            mthis.handleSlideAdd(index, el, slide)
        });

        this.infty.onSlidesChange(function(slides){
            mthis.handleSlidesChange(slides);
        })
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
     * Atzīmējam kalendārā aktīvo datumu
     * aktīvais datums ir this.date
     */
    setHighliteDate: function(date) {
        this.highliteDate = cloneDate(date);

        var mthis = this;
        // Jānomaina tikai datuma daļa visos kalendāros
        this.months.each(function(month){
            month.setHightliteDate(mthis.highliteDate)
        })
    },

    /**
     * Iekšējā setDate metode. Nepārbaudām vai ir jāpārkārto slaidi
     */
    _setDate: function(date) {
        this.date = cloneDate(date);
        this.dateSwitch.setDate(date);
    },

    /**
     * Publiskā metode datuma uzstādīšanai
     */
    setDate: function(date) {
        // Tas pats datums. Neko nedarām
        // Vajag iespēju force reset date
        // if (isSameDate(this.date, date)) {
        //     return;
        // }

        this._setDate(date);

        /**
         * @todo Uztaisīt, lai gadījumā, ja uzstādāmā datuma
         * slide ir pieejams, tad pārslēgots uz to nevis pārtaisītu
         * visu kalendāru.
         * Pašlaik, pēc infty.showSlide izsaukšanas pārslēdzoties
         * uz prev ir metās kļūda no infty
         */
        this.inftySlidesDate = cloneDate(this.date);
        this.infty.restart();

        this.setHighliteDate(date);
    },


    /**
     * Return month element
     * @param number Year
     * @param number Month, 1 based
     */
    getMonth: function(year, month) {
        return this.months.findByYearMonth(year, month);
    },

    /**
     * Return date elements. There could be more then one element
     * because date is also in prev and next month slides
     */
    getDate: function(year, month, date) {

    },

    handleMonthDayClick: function(day) {
        var mthis = this;

        /**
         * @todo Varbūt vajag parametru ar kuru nosakām vai vajag pāršķirt mēnesi, jad
         * ieklikšķināts nākošā mēneša dienā
         */
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

        this._setDate(day.date);
        this.setHighliteDate(day.date);

        this.fire('dateclick', [day.date]);
    },

    handleSlideAdd: function(index, el, slide) {
        // Pārbaudām vai slide elementā jau ir mēneša elements
        var month = this.months.findMonthByConainer(el);

        if (!month) {
            month = this.months.push(new monthEl(addMonths(this.inftySlidesDate, index), this.props));
        }
        else {
            month.setDate(addMonths(this.inftySlidesDate, index))
        }

        // Uzstādām highliteDate
        month.setHightliteDate(this.highliteDate)

        slide.setData('date', month.getDate());

        emptyElement(el).appendChild(month.el);
    },

    handleSlideChange: function() {
        var current = this.infty.getCurrent();
        var month = this.months.findMonthByConainer(current.el);

        this._setDate(month.getDate())

        this.fire('slidechange', [month.getDate()]);
    },

    /**
     * Tad, kad ir noformēti visi ielādētie kalendāru slides, tad
     * palaižam event un tajā padodam visus ielādēto kalendāru mēnešus
     */
    handleSlidesChange: function(slides) {
        var r = [];
        for (var i = 0; i < slides.length; i++) {
            // Ņemam tikai slide uzstādīto datumu
            r.push(slides[i].getData('date'))
        }

        this.fire('slideschange', [r]);
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
            positionItems: this.props.get('positionSlides', true),
            slidesPadding: this.props.get('slidesPadding', 0)
        })
    },

    /**
     * Pārzīmē visus kalendārus
     */
    refresh: function() {
        // Jānomaina tikai datuma daļa visos kalendāros
        this.months.each(function(month){
            month.refresh()
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