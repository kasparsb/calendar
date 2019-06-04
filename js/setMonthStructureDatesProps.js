var getDateProps = require('./getDateProps');

/**
 * @todo currentDate ir jāpārsauc par currentMonth
 */
function setMonthStructureDatesProps(structure, currentMonth, highliteDate) {
    for (var w = 0; w < structure.length; w++) {
        for (var d = 0; d < structure[w].length; d++) {
            structure[w][d] = {
                date: structure[w][d],
                dateProps: getDateProps(structure[w][d], currentMonth, highliteDate)
            }
        }
    }

    return structure;
}

module.exports = setMonthStructureDatesProps;