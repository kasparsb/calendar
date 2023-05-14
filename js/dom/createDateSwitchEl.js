import {jsx, q, replaceContent} from 'dom-helpers';
import {ymd} from '../formatDate';
import {classNames} from './CssClassNames';

function defaultNavPrevFormatter() {
    return '<';
}

function defaultNavNextFormatter() {
    return '>';
}

function defaultFullDateFormatter(date) {
    return ymd(date);
}

function createDateSwitchEl(date, props, cssPrefix) {

    let cs = classNames(cssPrefix);

    let navPrevFormatter = props.get('navPrevFormatter', defaultNavPrevFormatter);
    let navNextFormatter = props.get('navNextFormatter', defaultNavNextFormatter);
    let fullDateFormatter = props.get('fullDateFormatter', defaultFullDateFormatter);

    let el = (
        <div class={cs('calendar-switch')}>
            <a data-navprev class={cs('calendar-nav', 'calendar-navprev')}></a>
            <a data-datecaption class={cs('calendar-datecaption')}></a>
            <a data-navnext class={cs('calendar-nav', 'calendar-navnext')}></a>
        </div>
    );

    replaceContent(q(el, '[data-navprev]'), navPrevFormatter());
    replaceContent(q(el, '[data-datecaption]'), fullDateFormatter(date));
    replaceContent(q(el, '[data-navnext]'), navNextFormatter());

    return {
        getEl() {
            return el;
        },
        setDate(date) {
            replaceContent(q(el, '[data-datecaption]'), fullDateFormatter(date));
        }
    }
}

export default createDateSwitchEl