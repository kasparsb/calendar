/**
 * Apply callback for each item of 2 dimensional array
 */
function each2d(arr, cb) {
    for (var i = 0; i < arr.length; i++) {
        for (var j = 0; j < arr[i].length; j++) {
            cb(arr[i][j], i, j);
        }
    }
}

module.exports = each2d;