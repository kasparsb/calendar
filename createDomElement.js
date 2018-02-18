var createDomDayElement = require('./createDomDayElement');

function addCssClasses(el, s) {

    var c = ['calendar__date'];
    
    if (s.prevMonth) {
        c.push('calendar__date--prevmonth');
    }
    else if (s.nextMonth) {
        c.push('calendar__date--nextmonth');
    }
    else if (s.currMonth) {
        c.push('calendar__date--currentmonth');
    }

    el.className = c.join(' ');
}

function createDomElement(monthStructure) {
    var el = document.createElement('div'), dayEl, weekEl;
    el.className = 'calendar';

    for (var w = 0; w < monthStructure.length; w++) {

        weekEl = document.createElement('div');
        weekEl.className = 'calendar__week';

        for (var d = 0; d < monthStructure[w].length; d++) {

            dayEl = createDomDayElement(monthStructure[w][d].date);

            // Uzstādām dažādas css klases, kas raksturo datumu
            addCssClasses(dayEl, monthStructure[w][d])

            weekEl.appendChild(dayEl);
        }

        el.appendChild(weekEl);

    }

    return el;
}

module.exports = createDomElement;