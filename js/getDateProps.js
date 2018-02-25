var isSameMonth = require('./isSameMonth');
var isSameDate = require('./isSameDate');
var isLowerMonthThan = require('./isLowerMonthThan');
var isHigherMonthThan = require('./isHigherMonthThan');
var dayOfWeek = require('./dayOfWeek');

function getDateProps(date, currentDate) {
    return {
        currMonth: isSameMonth(date, currentDate),
        currDate: isSameDate(date, currentDate),
        prevMonth: isLowerMonthThan(date, currentDate),
        nextMonth: isHigherMonthThan(date, currentDate),
        weekDay: dayOfWeek(date)
    }
}

module.exports = getDateProps;