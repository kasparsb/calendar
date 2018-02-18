/**
 * Atgriežam jaunu datuma objektu, kuram pielikts norādītais skaits dienu
 * @param object Datums
 * @param number Dienu skaits ko pielikts. Ja neg, tad atņemt
 */
function addDays(date, daysCount) {
    var d = new Date(date.getTime());

    d.setDate(d.getDate()+daysCount);

    return d;
}

module.exports = addDays;