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


function createDomDayElement(date) {
    this.el = addCssClasses(document.createElement('div'), date);
    
    this.dateTextNode = document.createTextNode(date.date.getDate());

    this.el.appendChild(this.dateTextNode);
}

createDomDayElement.prototype = {
    getEl: function() {
        return this.el;
    },
    setDate: function(date) {
         addCssClasses(this.el, date);

        this.dateTextNode.nodeValue = date.date.getDate()
    }
}

module.exports = createDomDayElement;