function each(arr, cb) {
    for (var i = 0; i < arr.length; i++) {
        cb(arr[i], i);
    }
}

module.exports = each;