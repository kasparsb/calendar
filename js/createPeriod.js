import daysInMonth from './daysInMonth';
import cloneDate from './cloneDate';
import dayOfWeek from './dayOfWeek';
import addDays from './addDays';
import periodDaysCount from './periodDaysCount';



/**
 * Notice par Period
 *
 * Period ir objekts ar prop
 *     from
 *     till
 *
 * perioda till netike ieskaitīts
 * Nedēļas ietvaros till būs nākošās nedēļas sākuma datums
 * Tas pats arī attiecas uz mēnesi. Till būs nākošā mēneša
 * sākuma datums.
 */


/**
 * Return start of and end of week of provided date
 *
 * @param count cik nedēļas pievienot
 */
function week(date, count) {

    if (typeof count == 'undefined') {
        count = 1;
    }

    let from = addDays(date, -(dayOfWeek(date) - 1));

    let till = addDays(date, ((7*count) + 1) - dayOfWeek(date));

    return {from, till}
}

/**
 *
 * @param count cik mēnešus pievienot
 */
function month(date, count) {

    if (typeof count == 'undefined') {
        count = 1;
    }

    let monthDay = date.getDate();

    let from = addDays(date, -(monthDay - 1));

    let till = cloneDate(from);
    till.setMonth(till.getMonth()+1*count);

    return {from, till}
}

/**
 * Perioda sākums vienmēr būs
 * nedēļas sākums, kurā sākas mēnesis
 * Beigas, nedēļas beigas, kurā beidzas mēnesis
 */
function monthWithFullWeeks(date, count) {
    let period = month(date, count);

    period.from = addDays(period.from, -(dayOfWeek(period.from)-1));

    let d = dayOfWeek(period.till);
    // pirmdienu neaiztiekam, jo tad beigas ir pilna nedēļa
    if (d > 1) {
        period.till = addDays(period.till, 7-d+1);
    }

    // Nodrošinām, lai vienmēr būtu 6 nedēļas
    if (periodDaysCount(period.from, period.till) < 42) {
        // piemetam vēl vienu nedēļu
        period.till = addDays(period.till, 7);
    }

    return period;
}

export {
    week,
    month,
    monthWithFullWeeks
}