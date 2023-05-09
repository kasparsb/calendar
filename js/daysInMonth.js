/**
 * Month jāpadod NEzero based
 * 1 - janvāris
 * 12 - decembris
 */
function daysInMonth(date) {

    let year;
    let month;

    if (arguments.length > 1) {
        year = date;
        month = arguments[1];
    }
    // Padots date
    else {
        year = date.getFullYear();
        month = date.getMonth() + 1;
    }

    return new Date(year, month, 0).getDate();
}

export default daysInMonth;