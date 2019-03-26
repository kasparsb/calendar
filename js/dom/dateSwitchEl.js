function navPrev(props) {
    var el = document.createElement('a');
    el.className = 'calendar__nav calendar__nav--prev';

    var c = props.get('navPrevFormatter', defaultNavPrevFormatter)()

    /**
     * Ja formatter atgriež string, tad veidojam document.createTextNode
     * pretējā gadījumā vienkārši appendChild
     */
    el.appendChild(
        typeof c == 'string' ? document.createTextNode(c) : c
    );

    return el;
}

function navNext(props) {
    var el = document.createElement('a');
    el.className = 'calendar__nav calendar__nav--next';

    var c = props.get('navNextFormatter', defaultNavNextFormatter)()

    /**
     * Ja formatter atgriež string, tad veidojam document.createTextNode
     * pretējā gadījumā vienkārši appendChild
     */
    el.appendChild(
        typeof c == 'string' ? document.createTextNode(c) : c
    );

    return el;
}

function dateCaption(date, captionTextNode) {
    var el = document.createElement('a');
    el.className = 'calendar__datecaption';

    el.appendChild(captionTextNode);

    return el;
}

function dateCaptionTextNode(date, props) {
    return document.createTextNode(props.get('fullDateFormatter', defaultFullDateFormatter)(date))
}

function defaultFullDateFormatter(date) {
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
}

function defaultNavPrevFormatter() {
    return '<';
}

function defaultNavNextFormatter() {
    return '>';
}

function dateSwitchDomElement(date, props) {
    
    this.props = props;

    this.el = document.createElement('div');
    
    this.navPrev = navPrev(this.props);
    this.navNext = navNext(this.props);
    this.dateCaptionTextNode = dateCaptionTextNode(date, this.props)
    this.dateCaption = dateCaption(date, this.dateCaptionTextNode);
    
    this.el.className = 'calendar__switch';

    this.el.appendChild(this.navPrev);
    this.el.appendChild(this.dateCaption);
    this.el.appendChild(this.navNext);
}

dateSwitchDomElement.prototype = {
    getEl: function() {
        return this.el;
    },
    
    getNavPrev: function() {
        return this.navPrev;
    },
    getNavNext: function() {
        return this.navNext;
    },
    getDateCaption: function() {
        return this.dateCaption
    },

    isNavPrev: function(el) {
        return this.navPrev == el;
    },
    isNavNext: function(el) {
        return this.navNext == el;
    },
    isDateCaption: function(el) {
        return this.dateCaption == el;
    },

    setDate: function(date) {
        this.dateCaptionTextNode.nodeValue = this.props.get('fullDateFormatter', defaultFullDateFormatter)(date)
    }
}

module.exports = dateSwitchDomElement;