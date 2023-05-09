let day24h = 1000 * 60 * 60 * 24;

function periodDaysCount(from, till) {
    return Math.round((till - from) / day24h);
}

export default periodDaysCount;