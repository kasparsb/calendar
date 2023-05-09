function isLowerMonthThan(date1, date2) {
    if (date1.getFullYear() < date2.getFullYear()) {
        return true;
    }
    else if (date1.getFullYear() == date2.getFullYear()) {
        if (date1.getMonth() < date2.getMonth()) {
            return true;
        }
    }
    return false;
}

export default isLowerMonthThan;