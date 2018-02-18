var weekStructure = require('./weekStructure');

function monthStructure(date) {
    if (typeof date == 'undefined') {
        date = new Date();
    }

    var s = [], start = 1, d = new Date(date.getTime());

    // Veidojam struktūru ar 6 nedēļām
    for (var i = 0; i < 6; i++) {
        
        d.setDate(start)

        s.push(weekStructure(d))

        start += 7;
    }

    return s;
}

module.exports = monthStructure;