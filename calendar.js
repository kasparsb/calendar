var monthStructure = require('./monthStructure');
var monthDomElement = require('./monthDomElement');

module.exports = {
    calendar: function(date) {
        return monthDomElement(monthStructure(date), date);
    }
}