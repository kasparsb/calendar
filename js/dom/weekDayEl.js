var emptyElement = require('./emptyElement');

var abr = ['M', 'T', 'W', 'Th', 'F', 'S', 'Sn'];
var props;

function addCssClasses(el, prefix) {

    el.className = prefix+'calendar__weekday';

    return el;
}

/**
 * Noklusētais datuma formatētājs
 */
function defaultWeekDayFormatter(day, currentEl) {
    if (currentEl) {
        currentEl.nodeValue = props.get('weekDayToText', defaultWeekDayToText)(day)
    }
    else {
        currentEl = document.createTextNode(props.get('weekDayToText', defaultWeekDayToText)(day));
    }

    return currentEl;
}

function createDomWeekDayElement(day, properties) {
    props = properties;
    this.cssPrefix = props.get('cssPrefix', '');


    this.el = addCssClasses(document.createElement('div'), this.cssPrefix);

    this.elContent = props.get('weekDayFormatter', defaultWeekDayFormatter)(day, null);

    this.el.appendChild(this.elContent);
}

function defaultWeekDayToText(index) {
    return abr[index];
}

createDomWeekDayElement.prototype = {
    getEl: function() {
        return this.el;
    }
}

module.exports = createDomWeekDayElement;