import ce from 'dom-helpers/src/ce';
import append from 'dom-helpers/src/append';
import replaceContent from 'dom-helpers/src/replaceContent';

import {classNames} from './CssClassNames';

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

function createWeekDaysEl(props, cssPrefix) {

    let cs = classNames(cssPrefix);

    weekdayToTextFormatter = props.get('weekDayToText', defaultWeekDayToText);
    let weekdayFormatter = props.get('weekDayFormatter', defaultWeekDayFormatter);

    let el = ce(
        'div',
        {
            class: cs('calendar-grid', 'calendar-weekdays')
        }
    );

    for (let dayIndex = 1; dayIndex <= 7; dayIndex++) {
        let wdEl = append(el, ce(
            'div',
            {
                class: cs('calendar-weekday', 'calendar--wd-'+dayIndex)
            }
        ));

        let wdContent = weekdayFormatter(dayIndex);
        if (wdContent) {
            replaceContent(wdEl, wdContent)
        }
    }

    return el;
}

export default createWeekDaysEl