function isSameMonth(date1, date2) {
    if (date1.getFullYear() == date2.getFullYear() && date1.getMonth() == date2.getMonth()) {
        return true;
    }
    return false;
}

module.exports = isSameMonth;