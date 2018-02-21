var dateSwitchDomElement = require('./dateSwitchDomElement');
var monthDomElement = require('./monthDomElement');

function calendarDomElement(monthStructure, currentDate) {
    var el = document.createElement('div');

    el.className = 'calendar';

    el.appendChild(
        dateSwitchDomElement(currentDate)
    );

    el.appendChild(
        monthDomElement(monthStructure, currentDate)
    );

    return el;
}

module.exports = calendarDomElement;