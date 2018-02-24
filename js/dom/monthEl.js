var getMonthStructure = require('../monthStructure');
var setMonthStructureDatesProps = require('../setMonthStructureDatesProps');

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
        for (var i = 0; i < this.days.length; i++) {
            for (var j = 0; j < this.days[i].length; j++) {
                if (this.days[i][j].el.getEl().contains(el)) {
                    return this.days[i][j].data;
                }    
            }
        }

        return false;
    },
    setDate: function(date) {
        var monthStructure = setMonthStructureDatesProps(getMonthStructure(date), date)

        for (var w = 0; w < monthStructure.length; w++) {
            for (var d = 0; d < monthStructure[w].length; d++) {
                this.days[w][d].data = monthStructure[w][d];
                this.days[w][d].el.setDate(monthStructure[w][d])
            }
        }
    }
}

module.exports = monthEl;