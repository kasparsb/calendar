var cloneDate = require('./cloneDate');

/**
 * Atgriežam jaunu datuma objektu, kuram pielikts norādītais skaits dienu
 * @param object Datums
 * @param number Dienu skaits ko pielikts. Ja neg, tad atņemt
 */
function addDays(date, daysCount) {
    var d = cloneDate(date);

    d.setDate(d.getDate()+daysCount);

    return d;
}

module.exports = addDays;