function find2d(arr, cb, foundItemCb) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            if (cb(arr[i][j], i, j) === true) {
                if (foundItemCb) {
                    return foundItemCb(arr[i][j]);
                }
                else {
                    return arr[i][j];    
                }
            }
        }
    }

    return false;
}

module.exports = find2d;