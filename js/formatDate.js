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

export {ymd};