var each = require('../each');

function months() {
    this.months = []
}

months.prototype = {
    push: function(month) {
        this.months.push(month)
    },
    each: function(cb) {
        each(this.months, cb)
    },
    findDayByEl: function(el) {
        var r = false;
        for (var i = 0; i < this.months.length; i++) {
            r = this.months[i].findDayByEl(el);
            if (r) {
                break;
            }
        }
        return r;
    }
}

module.exports = months