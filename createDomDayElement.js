function createDomDayElement(date) {
    var d = document.createElement('div');
    d.appendChild(document.createTextNode(date.getDate()));

    return d;
}

module.exports = createDomDayElement;