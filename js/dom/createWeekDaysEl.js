import {jsx, append, replaceContent} from 'dom-helpers';

let abr = ['', 'M', 'T', 'W', 'Th', 'F', 'S', 'Sn'];

let weekdayToTextFormatter;

function defaultWeekDayToText(dayIndex) {
    return abr[dayIndex];
}

function defaultWeekDayFormatter(dayIndex, currentEl) {
    if (!currentEl) {
        currentEl = document.createTextNode(weekdayToTextFormatter(dayIndex));
        return currentEl;
    }

    currentEl.nodeValue = weekdayToTextFormatter(day)

    return null;
}

function createWeekDaysEl(props) {

    weekdayToTextFormatter = props.get('weekDayToText', defaultWeekDayToText);
    let weekdayFormatter = props.get('weekDayFormatter', defaultWeekDayFormatter);

    let el = <div class="calendar__weekdays"></div>;

    for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
        let classes = [
            'calendar__weekday',
            'calendar__weekday--wd-'+dayIndex
        ];
        let wdEl = append(el, <div class={classes.join(' ')}></div>);

        let wdContent = weekdayFormatter(dayIndex);
        if (wdContent) {
            replaceContent(wdEl, wdContent)
        }
    }

    return el;
}

export default createWeekDaysEl