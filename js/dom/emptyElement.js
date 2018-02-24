function emptyElement(el) {
    while(el.firstChild) {
        el.removeChild(el.firstChild);
    }

    return el;
}

module.exports = emptyElement;