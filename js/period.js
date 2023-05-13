import cloneDate from './cloneDate';
import isSameDate from './isSameDate';

function Period(period) {
    this.from = period && period.from ? period.from : null;
    this.till = period && period.till ? period.till : null;
}
Period.prototype = {

    isEmpty() {
        if (this.from) {
            return false;
        }

        if (this.till) {
            return false;
        }

        return true;
    },

    hasFullPeriod() {
        if (this.from && this.till) {
            return true;
        }

        return false;
    },

    hasPeriodFrom() {
        if (this.from) {
            return true;
        }
        return false;
    },

    hasPeriodTill() {
        if (this.till) {
            return true;
        }
        return false;
    },

    isStart(date) {
        if (this.isEmpty()) {
            return false;
        }

        if (!this.from) {
            return false;
        }

        return isSameDate(date, this.from)
    },

    isEnd(date) {
        if (this.isEmpty()) {
            return false;
        }

        if (!this.till) {
            return false;
        }

        return isSameDate(date, this.till)
    },

    isIn(date) {
        if (this.isEmpty()) {
            return false;
        }

        if (date >= this.from && date <= this.till) {
            return true;
        }

        return false;
    },

    swap() {
        let tmp = this.from;
        this.from = this.till;
        this.till = tmp;
    },

    swapIfMissOrdered() {
        if (this.hasFullPeriod()) {
            if (this.till < this.from) {
                this.swap();
            }
        }
    },

    toObj() {
        if (this.isEmpty()) {
            return null;
        }

        return {
            from: this.from ? cloneDate(this.from) : null,
            till: this.till ? cloneDate(this.till) : null
        }
    }
}

export default Period;