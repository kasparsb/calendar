var isSameMonth = require('./isSameMonth');
var isSameDate = require('./isSameDate');
var isLowerMonthThan = require('./isLowerMonthThan');
var isHigherMonthThan = require('./isHigherMonthThan');
var dayOfWeek = require('./dayOfWeek');

function getDateProps(date, currentMonth, hightliteDate) {
    return {
        currMonth: isSameMonth(date, currentMonth),
        currDate: isSameDate(date, currentMonth),
        highliteDate: hightliteDate ? isSameDate(date, hightliteDate) : false,
        prevMonth: isLowerMonthThan(date, currentMonth),
        nextMonth: isHigherMonthThan(date, currentMonth),
        weekDay: dayOfWeek(date)
    }
}

module.exports = getDateProps;