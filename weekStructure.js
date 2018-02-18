var addDays = require('./addDays');
var dayOfWeek = require('./dayOfWeek')
var monthExtremes = require('./monthExtremes')

function weekStructure(date) {
    if (date == 'undefined') {
        date = new Date();
    }

    var d, s = [], start = -dayOfWeek(date), isPrev, isNext, isCurrent;

    // Savācam masīvu ar dienu datumiem
    for (var i = 0; i <= 6; i++) {
        s.push(addDays(date, ++start));
    }

    var extremes = monthExtremes.find(s);
    
    for (var i = 0; i < s.length; i++) {
        
        isPrev = monthExtremes.isEqual(s[i], extremes.low);
        isNext = monthExtremes.isEqual(s[i], extremes.high);
        isCurrent = false;
        
        // Ja vienlaicīgi gan prev, gan next, tad tas ir current month
        if (isPrev && isNext) {
            isCurrent = true;

            isPrev = false;
            isNext = false;
        }
        
        s[i] = {
            prevMonth: isPrev,
            nextMonth: isNext,
            currMonth: isCurrent,
            date: s[i]
        }
    }

    return s;
}

module.exports = weekStructure;