function isjQuery(obj) {
    return obj instanceof jQuery;
}

function isArray(obj) {
    return (
        Object.prototype.toString.call(obj) === '[object Array]'
        || Object.prototype.toString.call(obj) === '[object HTMLCollection]'
        || Object.prototype.toString.call(obj) === '[object NodeList]'
    );
}


/**
 * jQuery, DOM or array items collection
 */
function elementsCollection(items) {
    this.items = items;

    this.itemsType = '';

    if (isjQuery(this.items)) {
        this.itemsType = 'jquery';
    }
    else if (isArray(this.items)) {
        this.itemsType = 'array';
    }
}

elementsCollection.prototype = {
    each: function(cb) {
        switch (this.itemsType) {
            case 'jquery':
                this.items.each(function(i){
                    cb(this, i)
                });
                break;
            case 'array':
                for (var i = 0; i < this.items.length; i++) {
                    cb(this.items[i], i);
                }
                break;
        }
    }
}

module.exports = elementsCollection