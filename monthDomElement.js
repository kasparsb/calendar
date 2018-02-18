var dayDomElement = require('./dayDomElement');
var isSameMonth = require('./isSameMonth');
var isLowerMonthThan = require('./isLowerMonthThan');
var isHigherMonthThan = require('./isHigherMonthThan');

function addCssClasses(el, date, currentDate) {

    var c = ['calendar__date'];

    if (isSameMonth(date, currentDate)) {
        c.push('calendar__date--currentmonth');
    }
    else if (isLowerMonthThan(date, currentDate)) {
        c.push('calendar__date--prevmonth');
    }
    else if (isHigherMonthThan(date, currentDate)) {
        c.push('calendar__date--nextmonth');
    }

    el.className = c.join(' ');
}

function createDomElement(monthStructure, currentDate) {
    var el = document.createElement('div'), dayEl, weekEl;
    el.className = 'calendar';

    for (var w = 0; w < monthStructure.length; w++) {

        weekEl = document.createElement('div');
        weekEl.className = 'calendar__week';

        for (var d = 0; d < monthStructure[w].length; d++) {

            dayEl = dayDomElement(monthStructure[w][d]);

            // Uzstādām dažādas css klases, kas raksturo datumu
            addCssClasses(dayEl, monthStructure[w][d], currentDate)

            weekEl.appendChild(dayEl);
        }

        el.appendChild(weekEl);

    }

    return el;
}

module.exports = createDomElement;