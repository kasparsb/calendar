var isChildElement = require('../isChildElement');

function navPrev(props) {
    var cssPrefix = props.get('cssPrefix', '');

    var el = document.createElement('a');
    el.className = cssPrefix+'calendar__nav '+cssPrefix+'calendar__nav--prev';

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
    var cssPrefix = props.get('cssPrefix', '');

    var el = document.createElement('a');
    el.className = cssPrefix+'calendar__nav '+cssPrefix+'calendar__nav--next';

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

function dateCaption(date, captionTextNode, cssPrefix) {
    var el = document.createElement('a');
    el.className = cssPrefix+'calendar__datecaption';

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
    this.cssPrefix = this.props.get('cssPrefix', '');

    this.el = document.createElement('div');

    this.navPrev = navPrev(this.props);
    this.navNext = navNext(this.props);
    this.dateCaptionTextNode = dateCaptionTextNode(date, this.props)
    this.dateCaption = dateCaption(date, this.dateCaptionTextNode, this.cssPrefix);

    this.el.className = this.cssPrefix+'calendar__switch';

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
        return (this.navPrev == el || isChildElement(el, this.navPrev));
    },
    isNavNext: function(el) {
        return (this.navNext == el || isChildElement(el, this.navNext));
    },
    isDateCaption: function(el) {
        return this.dateCaption == el;
    },

    setDate: function(date) {
        this.dateCaptionTextNode.nodeValue = this.props.get('fullDateFormatter', defaultFullDateFormatter)(date)
    }
}

module.exports = dateSwitchDomElement;