var each = require('../each');

function jQueryCollection() {
    this.items = []
}

jQueryCollection.prototype = {
    push: function(el) {
        this.items.push(el)
    },

    each: function(cb) {
        each(this.items, function(item, i){
            cb.apply(item, [i])
        })
    }
}

module.exports = jQueryCollection