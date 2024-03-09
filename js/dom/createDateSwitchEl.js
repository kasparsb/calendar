import ce from 'dom-helpers/src/ce';
import q from 'dom-helpers/src/q';
import replaceContent from 'dom-helpers/src/replaceContent';

import {Fy} from '../formatDate';
import {classNames} from './CssClassNames';

function defaultNavPrevFormatter() {
    return '<';
}

function defaultNavNextFormatter() {
    return '>';
}

function defaultDateCaptionFormatter(date) {
    return Fy(date);
}

function createDateSwitchEl(date, props, cssPrefix) {

    let cs = classNames(cssPrefix);

    let navPrevFormatter = props.get('navPrevFormatter', defaultNavPrevFormatter);
    let navNextFormatter = props.get('navNextFormatter', defaultNavNextFormatter);
    let dateCaptionFormatter = props.get('dateCaptionFormatter', defaultDateCaptionFormatter);


    /**
     * <div class="calendar-switch">
     *     <a data-navprev class="calendar-nav calendar-navprev"></a>
     *     <a data-datecaption class="calendar-datecaption"></a>
     *     <a data-navnext class="calendar-nav calendar-navnext"></a>
     * </div>
     */
    let el = ce(
        'div',
        {
            class: cs('calendar-switch')
        },
        ce(
            'a',
            {
                class: cs('calendar-nav', 'calendar-navprev'),
                data: {
                    navprev: '',
                }
            }
        ),
        ce(
            'a',
            {
                class: cs('calendar-nav', 'calendar-datecaption'),
                data: {
                    datecaption: '',
                }
            }
        ),
        ce(
            'a',
            {
                class: cs('calendar-nav', 'calendar-navnext'),
                data: {
                    navnext: '',
                }
            }
        )
    );

    replaceContent(q(el, '[data-navprev]'), navPrevFormatter());
    replaceContent(q(el, '[data-datecaption]'), dateCaptionFormatter(date));
    replaceContent(q(el, '[data-navnext]'), navNextFormatter());

    return {
        getEl() {
            return el;
        },
        setDate(date) {
            replaceContent(q(el, '[data-datecaption]'), dateCaptionFormatter(date));
        }
    }
}

export default createDateSwitchEl