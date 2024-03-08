import cloneDate from './cloneDate';
import daysInMonth from './daysInMonth';

function findMinMaxDates(dates) {
    let min, max;

    dates.forEach(date => {
        date = cloneDate(date);
        date.setDate(1);
        date.setHours(0);
        date.setMinutes(0);
        date.setMilliseconds(0);

        if (!min) {
            min = cloneDate(date);
        }
        else if (min.getTime() > date.getTime()) {
            min = cloneDate(date);
        }

        date.setDate(daysInMonth(date));

        if (!max) {
            max = cloneDate(date);
        }
        else if (max.getTime() < date.getTime()) {
            max = cloneDate(date);
        }
    })

    return {min, max};
}

export default findMinMaxDates