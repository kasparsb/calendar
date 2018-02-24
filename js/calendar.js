var domRender = require('./dom/render');

module.exports = {
    dom: function(date) {
        return new domRender(date)
    }
}