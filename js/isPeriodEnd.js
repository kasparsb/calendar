import isSameDate from './isSameDate';

function isPeriodEnd(date, period) {
    if (!period.till) {
        return false;
    }

    return isSameDate(date, period.till)
}

export default isPeriodEnd;