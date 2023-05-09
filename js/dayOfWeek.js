/**
 * Nedēļas diena ir not zero based
 * Pirmdiena ir 1
 * Svētdiena ir 7
 */
function dayOfWeek(date) {
    if (typeof date == 'undefined') {
        date = new Date();
    }

    var r = date.getDay();
    // Svētdiena
    if (r == 0) {
        r = 7;
    }

    return r;
}

export default dayOfWeek;