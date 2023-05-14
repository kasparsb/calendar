function ClassesList(prefix, classesMap) {
    this.prefix = prefix;
    this.classesMap = classesMap;
}
ClassesList.prototype = {
    yes(name) {
        this.classesMap[name] = true;
    },
    no(name) {
        this.classesMap[name] = false;
    },
    className() {
        let r = [];
        for (let className in this.classesMap) {
            if (this.classesMap[className]) {
                r.push(this.prefix+className);
            }
        }
        return r.join(' ');
    }
}

/**
 * Funkcija, kuru izsaucot visi padotie argumenti tiek prefixoti
 */
function classNames(prefix) {
    return function() {
        return [...arguments].map(cl => prefix+cl).join(' ');
    }
}

export {classNames, ClassesList};