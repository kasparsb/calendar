function sp(s) {
    s = s+'';
    if (s.length == 1) {
        s = '0'+s;
    }
    return s;
}

function ymd(date) {
    return date.getFullYear()+'-'+sp(date.getMonth()+1)+'-'+sp(date.getDate());
}

function ym(date) {
    return date.getFullYear()+'-'+sp(date.getMonth()+1);
}

function yF(date) {
    return date.getFullYear()+' '+date.toLocaleString('default', { month: 'long' });
}

function Fy(date) {
    return date.toLocaleString('default', { month: 'long' })+' '+date.getFullYear();
}

function stringToDate(dateString) {

    // Sadalam pa datumu un laiku
    var dp = dateString.split(' ');

    // gads, mēnesis, diena
    var date = dp[0].split('-');
    // stundas, minūtes, sekundes
    var time = [0, 0, 0];
    if (dp.length > 1) {
        time = dp[1].split(':');
    }

    if ((date.length != 3) || (time.length != 3)) {
        return new Date();
    }

    return new Date(date[0], date[1]-1, date[2], time[0], time[1], time[2]);
}

/**
 * String or Date, always return Date
 */
function toDate(stringOrDate) {
    if (typeof stringOrDate == 'string' || stringOrDate instanceof(String)) {
        return stringToDate(stringOrDate);
    }
    else {
        return new Date(stringOrDate.getTime())
    }
}

export {ymd, ym, yF, Fy, stringToDate, toDate};