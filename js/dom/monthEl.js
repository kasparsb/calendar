var getMonthStructure = require('../monthStructure');
var setMonthStructureDatesProps = require('../setMonthStructureDatesProps');
var each2d = require('../each2d');
var find2d = require('../find2d');

var dayEl = require('./dayEl');

function monthEl(date, props) {
    var monthStructure = setMonthStructureDatesProps(getMonthStructure(date), date)

    this.el = document.createElement('div');
    this.el.className = 'calendar__month';

    this.days = [];

    var weekEl;
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
    findDayByEl: function(el) {
        return find2d(this.days, function(item){
            return item.el.getEl().contains(el)
        }, function(foundItem){
            return foundItem.data;
        })
    },
    setDate: function(date) {
        
        var mthis = this;

        each2d(setMonthStructureDatesProps(getMonthStructure(date), date), function(item, w, d){
            mthis.days[w][d].data = item;
            mthis.days[w][d].el.setDate(item)
        })
    }
}

module.exports = monthEl;