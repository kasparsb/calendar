var emptyElement = require('./emptyElement');

function addCssClasses(el, date) {

    var c = ['calendar__date'];

    if (date.dateProps.currMonth) {
        c.push('calendar__date--currentmonth');
    }
    else if (date.dateProps.prevMonth) {
        c.push('calendar__date--prevmonth');
    }
    else if (date.dateProps.nextMonth) {
        c.push('calendar__date--nextmonth');
    }

    if (date.dateProps.currDate) {
        c.push('calendar__date--currdate');
    }

    el.className = c.join(' ');

    return el;
}

/**
 * Noklusētais datuma formatētājs
 */
function defaultDateFormatter(date, currentEl) {
    if (currentEl) {
        currentEl.nodeValue = date.date.getDate()
    }
    else {
        currentEl = document.createTextNode(date.date.getDate());
    }

    return currentEl;
}

function createDomDayElement(date, props) {
    this.props = props;

    this.el = addCssClasses(document.createElement('div'), date);
    
    this.elContent = this.props.get('dateFormatter', defaultDateFormatter)(date, null);
    
    this.el.appendChild(this.elContent);
}

createDomDayElement.prototype = {
    getEl: function() {
        return this.el;
    },
    setDate: function(date) {
        addCssClasses(this.el, date);

        var newElContent = this.props.get('dateFormatter', defaultDateFormatter)(date, this.elContent)

        // Ja atgriezts cits elContent
        if (!this.el.contains(newElContent)) {
            this.elContent = newElContent;

            emptyElement(this.el).appendChild(this.elContent)
        }
    }
}

module.exports = createDomDayElement;