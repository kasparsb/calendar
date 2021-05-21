var emptyElement = require('./emptyElement');

function addCssClasses(el, date, prefix) {

    var c = [prefix+'calendar__date'];

    if (date.dateProps.currMonth) {
        c.push(prefix+'calendar__date--currentmonth');
    }
    else if (date.dateProps.prevMonth) {
        c.push(prefix+'calendar__date--prevmonth');
    }
    else if (date.dateProps.nextMonth) {
        c.push(prefix+'calendar__date--nextmonth');
    }

    // if (date.dateProps.currDate) {
    //     c.push('calendar__date--currdate');
    // }
    if (date.dateProps.highliteDate) {
        c.push(prefix+'calendar__date--currdate');
    }

    // Weekday
    c.push(prefix+'calendar__date--wd-'+date.dateProps.weekDay)

    el.className = c.join(' ');

    return el;
}

/**
 * Noklusētais datuma formatētājs
 */
function defaultMonthDayFormatter(date, currentEl) {
    if (currentEl) {
        currentEl.nodeValue = date.date.getDate()
    }
    else {
        currentEl = document.createTextNode(date.date.getDate());
    }

    return currentEl;
}

function createDomDayElement(date, props) {
    this.date = date;
    this.props = props;
    this.cssPrefix = this.props.get('cssPrefix', '');

    this.el = addCssClasses(document.createElement('div'), date, this.cssPrefix);

    this.elContent = this.props.get('monthDayFormatter', defaultMonthDayFormatter)(date, null);

    this.el.appendChild(this.elContent);
}

createDomDayElement.prototype = {
    getEl: function() {
        return this.el;
    },
    setDate: function(date) {
        this.date = date;
        addCssClasses(this.el, date, this.cssPrefix);

        var newElContent = this.props.get('monthDayFormatter', defaultMonthDayFormatter)(date, this.elContent)

        // Ja atgriezts cits elContent
        if (!this.el.contains(newElContent)) {
            this.elContent = newElContent;

            emptyElement(this.el).appendChild(this.elContent)
        }
    },
    refresh: function() {
        var newElContent = this.props.get('monthDayFormatter', defaultMonthDayFormatter)(this.date, this.elContent)

        // Ja atgriezts cits elContent
        if (!this.el.contains(newElContent)) {
            this.elContent = newElContent;

            emptyElement(this.el).appendChild(this.elContent)
        }
    }
}

module.exports = createDomDayElement;