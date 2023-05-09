function Properties(props) {
    this.props = typeof props == 'undefined' ? {} : props;
}

Properties.prototype = {
    get(propName, defaultValue) {
        if (typeof this.props[propName] == 'undefined') {
            return defaultValue;
        }

        return this.props[propName];
    }
}

export default Properties