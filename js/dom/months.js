var each = require('../each');
var find = require('../find');

function months() {
    this.months = []
}

months.prototype = {
    push: function(month) {
        this.months.push(month);
        
        return month;
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
    },
    /**
     * Atrodam to mēnesi, kura elements atrodas 
     * padotajā container elementā
     */
    findMonthByConainer: function(containerEl) {
        return find(this.months, function(item){
            return containerEl.contains(item.el)
        })
    }
}

module.exports = months