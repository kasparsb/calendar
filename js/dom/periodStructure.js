import addDays from '../addDays';
import cloneDate from '../cloneDate';
import ce from 'dom-helpers/src/ce';

function periodStructure(period) {

    let r = [];

    let date = cloneDate(period.from)

    while (date.getTime() < period.till.getTime()) {

        r.push(
            ce(
                'div',
                {
                    data: {
                        ts: date.getTime()
                    }
                }
            )
        );

        date = addDays(date, 1);
    }

    return r;
}

export default periodStructure;