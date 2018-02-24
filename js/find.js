function find(arr, cb, foundItemCb) {
    for (var i = 0; i < arr.length; i++) {
        if (cb(arr[i], i) === true) {
            if (foundItemCb) {
                return foundItemCb(arr[i]);
            }
            else {
                return arr[i];
            }
        }
    }

    return false;
}

module.exports = find2d;