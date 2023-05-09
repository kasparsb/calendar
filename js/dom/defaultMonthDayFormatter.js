/**
 * Create date cell content
 * On first call currentEl will be null, because date cell
 * is empty.
 * Create currentEl and return it. It will be appended to date cell
 * on next calls currentEl will previously created element
 * Update element here and return null
 * If function returns element it will be reappended in date cell
 * If function return null no append will be made
 */
function defaultMonthDayFormatter(date, currentEl) {

    // Create new because first call
    if (!currentEl) {
        return document.createTextNode(date.getDate());
    }

    // Update existing element
    currentEl.nodeValue = date.getDate();

    return null;
}

export default defaultMonthDayFormatter