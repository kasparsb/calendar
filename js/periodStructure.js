import addDays from './addDays';
import cloneDate from './cloneDate';
import {jsx} from 'dom-helpers';

function periodStructure(period) {

    let r = [];

    let date = cloneDate(period.from)

    while (date.getTime() < period.till.getTime()) {

        r.push(
            <div data-ts={date.getTime()}></div>
        );

        date = addDays(date, 1);
    }

    return r;
}

export default periodStructure;