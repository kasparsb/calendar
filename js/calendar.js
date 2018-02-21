var monthStructure = require('./monthStructure');
var calendarDomElement = require('./calendarDomElement');
var domEvents = require('./domEvents');

module.exports = {
    calendar: function(date) {
        var el = calendarDomElement(monthStructure(date), date)

        var eventsTarget = el;//document.getElementsByTagName('body')[0];

        domEvents.addEvent(eventsTarget, 'click', function(ev){
            console.log(domEvents.eventTarget(ev));
        })

        return el;
    }
}