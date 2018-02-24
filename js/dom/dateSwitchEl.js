function navPrev() {
    var el = document.createElement('a');
    el.className = 'calendar__nav calendar__nav--prev';

    el.appendChild(
        document.createTextNode('<')
    );

    return el;
}

function navNext() {
    var el = document.createElement('a');
    el.className = 'calendar__nav calendar__nav--next';

    el.appendChild(
        document.createTextNode('>')
    );

    return el;
}

function dateCaption(date, captionTextNode) {
    var el = document.createElement('a');
    el.className = 'calendar__datecaption';

    el.appendChild(captionTextNode);

    return el;
}

function dateCaptionTextNode(date) {
    return document.createTextNode(formatDate(date))
}

function formatDate(date) {
    return date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate()
}

function dateSwitchDomElement(date, props) {
    
    this.props = props;

    this.el = document.createElement('div');
    
    this.navPrev = navPrev();
    this.navNext = navNext();
    this.dateCaptionTextNode = dateCaptionTextNode(date)
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
        this.dateCaptionTextNode.nodeValue = formatDate(date)
    }
}

module.exports = dateSwitchDomElement;