function isPeriodIn(date, period) {
    if (!(period.from && period.till)) {
        return false;
    }

    if (date >= period.from && date <= period.till) {
        return true;
    }

    return false;
}

export default isPeriodIn;