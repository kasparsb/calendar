var getDateProps = require('./getDateProps');

function setMonthStructureDatesProps(structure, currentDate) {
    for (var w = 0; w < structure.length; w++) {
        for (var d = 0; d < structure[w].length; d++) {
            structure[w][d] = {
                date: structure[w][d],
                dateProps: getDateProps(structure[w][d], currentDate)
            }
        }
    }

    return structure;
}

module.exports = setMonthStructureDatesProps;