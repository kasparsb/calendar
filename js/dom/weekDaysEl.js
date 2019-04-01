var weekDayEl = require('./weekDayEl');

/**
 * Noklusētais formatētājs
 */
function defaultWeekDayFormatter(date, currentEl) {
    if (currentEl) {
        currentEl.nodeValue = date.date.getDate()
    }
    else {
        currentEl = document.createTextNode(date.date.getDate());
    }

    return currentEl;
}

function weekDaysDomElement(props) {
    
    this.props = props;

    this.el = document.createElement('div');
    this.el.className = 'calendar__weekdays';

    this.days = [];
    for (var i = 0; i < 7; i++) {
        this.days[i] = {
            el: new weekDayEl(i, this.props)
        }
        this.el.appendChild(this.days[i].el.getEl());
    }
}

weekDaysDomElement.prototype = {
    getEl: function() {
        return this.el;
    }
}

module.exports = weekDaysDomElement;