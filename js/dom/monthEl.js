var getMonthStructure = require('../monthStructure');
var setMonthStructureDatesProps = require('../setMonthStructureDatesProps');
var each2d = require('../each2d');
var find2d = require('../find2d');
var cloneDate = require('../cloneDate');
var daysInMonth = require('../daysInMonth');

var dayEl = require('./dayEl');

function monthEl(date, props) {
    this.el = document.createElement('div');
    this.el.className = 'calendar__month';

    this.date = cloneDate(date);

    this.days = [];

    var weekEl, monthStructure = setMonthStructureDatesProps(getMonthStructure(this.date), this.date);
    for (var w = 0; w < monthStructure.length; w++) {

        weekEl = document.createElement('div');
        weekEl.className = 'calendar__week';

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
    applyDateChanges: function(date) {
        var mthis = this;
        each2d(setMonthStructureDatesProps(getMonthStructure(date), date), function(item, w, d){
            mthis.days[w][d].data = item;
            mthis.days[w][d].el.setDate(item)
        })
    },
    setDate: function(date) {
        this.date = cloneDate(date);

        this.applyDateChanges(this.date);
    },
    /**
     * Nomainām tikai datuma (dd) daļu esošajā datumā
     */
    changeMonthDate: function(date) {
        // Ja datuma daļa neatšķiras, tad neturpinām
        if (this.date.getDate() == date) {
            return;
        }

        this.date.setDate(Math.min(date, daysInMonth(this.date.getFullYear(), this.date.getMonth()+1)))

        this.applyDateChanges(this.date);
    }
}

module.exports = monthEl;