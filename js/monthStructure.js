var weekStructure = require('./weekStructure');
var addDays = require('./addDays');

function monthStructure(date) {
    if (typeof date == 'undefined') {
        date = new Date();
    }

    var s = [], d = new Date(date.getTime());

    // Uzlieka mēneša sākumu
    d.setDate(1)

    // Veidojam struktūru ar 6 nedēļām
    for (var i = 0; i < 6; i++) {
        
        s.push(weekStructure(d))

        d = addDays(d, 7);
    }

    return s;
}

module.exports = monthStructure;