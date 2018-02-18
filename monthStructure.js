var weekStructure = require('./weekStructure');

function monthStructure(date) {
    if (typeof date == 'undefined') {
        date = new Date();
    }

    var s = [];
    var start = 1;
    
    // Veidojam struktūru ar 6 nedēļām
    for (var i = 0; i < 6; i++) {
        
        date.setDate(start)

        s.push(weekStructure(date))

        start += 7;
    }

    return s;
}

module.exports = monthStructure;