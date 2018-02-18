function s(year, month) {
    return {
        year: year,
        month: month
    }
}
function sd(date) {
    return s(date.getFullYear(), date.getMonth());
}

/**
 * Atrodam mazāko gadu un mēnesi
 * Atrodam lielāko gadu un mēnesi
 */
function findExtremes(dates) {
    // Katrai dienai jāsaliek pre month, current month vai next month pazīmes
    var low = s(999999, 999999);
    var high = s(-1, -1);


    for (var i = 0; i < dates.length; i++) {
        if (isLower(dates[i], low)) {
            low = sd(dates[i]);
        }
        
        if (isHigher(dates[i], high)) {
            high = sd(dates[i]);
        }
    }

    return {
        low: low,
        high: high
    }
}

function isLower(date, extreme)  {
    if (date.getFullYear() < extreme.year) {
        return true;
    }
    else if (date.getFullYear() == extreme.year) {
        if (date.getMonth() < extreme.month) {
            return true;
        }
    }

    return false;
}

function isHigher(date, extreme) {
    if (date.getFullYear() > extreme.year) {
        return true;
    }
    else if (date.getFullYear() == extreme.year) {
        if (date.getMonth() > extreme.month) {
            return true;
        }
    }

    return false;
}

function isEqual(date, extreme) {
    if (date.getFullYear() == extreme.year && date.getMonth() == extreme.month) {
        return true;
    }
    return false;
}

module.exports = {
    find: findExtremes,
    isLower: isLower,
    isHigher: isHigher,
    isEqual: isEqual
};