import isSameDate from './isSameDate';

function isPeriodStart(date, period) {
    if (!period.from) {
        return false;
    }

    return isSameDate(date, period.from)
}

export default isPeriodStart;