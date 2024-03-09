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

export {ymd, ym, yF, Fy};