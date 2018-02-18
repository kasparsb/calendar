var addDays = require('./addDays');
var dayOfWeek = require('./dayOfWeek')

function weekStructure(date) {
    if (date == 'undefined') {
        date = new Date();
    }

    var s = [], start = -dayOfWeek(date);

    // Savācam masīvu ar dienu datumiem
    for (var i = 0; i <= 6; i++) {
        s.push(addDays(date, ++start));
    }

    return s;
}

module.exports = weekStructure;