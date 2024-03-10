function isHigherDateThan(date1, date2) {
    if (date1.getFullYear() > date2.getFullYear()) {
        return true;
    }
    else if (date1.getFullYear() == date2.getFullYear()) {
        if (date1.getMonth() > date2.getMonth()) {
            return true;
        }
        else if (date1.getMonth() == date2.getMonth()) {
            if (date1.getDate() > date2.getDate()) {
                return true;
            }
        }
    }
    return false;
}

export default isHigherDateThan;