import cloneDate from './cloneDate';
import daysInMonth from './daysInMonth';

function addMonths(date, monthsCount) {
    var d = cloneDate(date);

    // Nolasām current date
    var n = d.getDate();

    // Uzliekam mēneša pirmo dienu. Lai nebūtu problēmu ar februāra mēnesi
    d.setDate(1);
    d.setMonth(d.getMonth() + monthsCount);

    // Mēģinām uzstādīt atpakaļ iepriekšējo datumu
    // Ja iepriekšējais datums ir lielāks nekā esošajā mēnesī,
    // tad uzstādām pēdējo iespējamo lielāko
    d.setDate(Math.min(n, daysInMonth(d.getFullYear(), d.getMonth()+1)));

    return d;
}

export default addMonths;