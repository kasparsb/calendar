var monthStructure = require('./monthStructure');
var createDomElement = require('./createDomElement');

module.exports = {
    calendar: function(date) {
        return createDomElement(monthStructure(date));
    }
}