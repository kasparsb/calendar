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

function dateCaption(date) {
    var el = document.createElement('a');
    el.className = 'calendar__datecaption';

    el.appendChild(
        document.createTextNode(date.getFullYear()+'-'+(date.getMonth()+1)+'-'+date.getDate())
    );

    return el;
}

function dateSwitchDomElement(currentDate) {
    var el = document.createElement('div');

    el.className = 'calendar__switch';

    el.appendChild(navPrev());
    el.appendChild(dateCaption(currentDate));
    el.appendChild(navNext());

    return el;
}

module.exports = dateSwitchDomElement;