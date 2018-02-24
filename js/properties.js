function properties(props) {
    this.props = typeof props == 'undefined' ? {} : props;
}

properties.prototype = {
    get: function(propName, defaultValue) {
        if (typeof this.props[propName] == 'undefined') {
            return defaultValue;
        }

        return this.props[propName];
    }
}

module.exports = properties