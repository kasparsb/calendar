var getMonthStructure = require('../monthStructure');
var setMonthStructureDatesProps = require('../setMonthStructureDatesProps');
var each2d = require('../each2d');
var find2d = require('../find2d');
var cloneDate = require('../cloneDate');
var daysInMonth = require('../daysInMonth');

var dayEl = require('./dayEl');

function monthEl(date, props) {
    this.cssPrefix = props.get('cssPrefix', '');

    this.el = document.createElement('div');
    this.el.className = this.cssPrefix+'calendar__month';

    this.date = cloneDate(date);

    // Datums, kurš kā izvēlētais
    this.hightliteDate = null;

    this.days = [];


    var weekEl, monthStructure = setMonthStructureDatesProps(getMonthStructure(this.date), this.date, this.hightliteDate);
    for (var w = 0; w < monthStructure.length; w++) {

        weekEl = document.createElement('div');
        weekEl = addClassNames(weekEl, monthStructure[w], this.cssPrefix);

        for (var d = 0; d < monthStructure[w].length; d++) {

            if (typeof this.days[w] == 'undefined') {
                this.days[w] = [];
            }

            this.days[w][d] = {
                data: monthStructure[w][d],
                el: new dayEl(monthStructure[w][d], props)
            }

            // Uzstādām dažādas css klases, kas raksturo datumu
            weekEl.appendChild(this.days[w][d].el.getEl());
        }

        this.el.appendChild(weekEl);
    }
}

function addClassNames(weekEl, week, cssPrefix) {
    weekEl.className = cssPrefix+'calendar__week';

    if (isAnyDay(week, 'prev')) {
        weekEl.className += ' '+cssPrefix+'calendar__week--prevmonth';
    }
    if (isAnyDay(week, 'curr')) {
        weekEl.className += ' '+cssPrefix+'calendar__week--currmonth';
    }
    if (isAnyDay(week, 'next')) {
        weekEl.className += ' '+cssPrefix+'calendar__week--nextmonth';
    }

    return weekEl;
}

/**
 * Nosakām vai padotajā nedēļā kaut viens datums ir
 * ar norādīto pazīmi. Vai visi datumi ir prev, curr vai next
 */
function isAnyDay(week, markName) {
    // Ja kaut viena no dienu pazīmes nav true, tad return false
    for (var i = 0; i < week.length; i++) {
        if (week[i].dateProps[markName+'Month']) {
            return true;
        }
    }
    return false;
}

monthEl.prototype = {
    getEl: function() {
        return this.el;
    },
    getDays: function() {
        return this.days
    },
    getDate: function() {
        return this.date;
    },
    findDayByEl: function(el) {
        return find2d(this.days, function(item){
            return item.el.getEl().contains(el)
        }, function(foundItem){
            return foundItem.data;
        })
    },
    applyDateChanges: function(date, highliteDate) {
        var mthis = this;
        each2d(setMonthStructureDatesProps(getMonthStructure(date), date, highliteDate), function(item, w, d){
            mthis.days[w][d].data = item;
            mthis.days[w][d].el.setDate(item)
        })
    },
    setDate: function(date) {
        this.date = cloneDate(date);

        this.applyDateChanges(this.date, this.hightliteDate);
    },
    /**
     * Nomainām tikai datuma !!(dd) daļu esošajā datumā
     */
    changeMonthDate: function(date) {
        // Ja datuma daļa neatšķiras, tad neturpinām
        if (this.date.getDate() == date) {
            return;
        }

        // Neļaujam uzlikt lielāku datumu kā tekošajā mēnesī ir dienu
        this.date.setDate(Math.min(date, daysInMonth(this.date.getFullYear(), this.date.getMonth()+1)))

        this.applyDateChanges(this.date, this.hightliteDate);
    },
    setHightliteDate: function(date) {
        this.hightliteDate = date;

        this.applyDateChanges(this.date, this.hightliteDate);
    },
    refresh: function() {
        each2d(this.days, function(item){
            item.el.refresh()
        })
    }
}

module.exports = monthEl;