import {jsx, q, replaceContent} from 'dom-helpers';
import {ymd} from '../formatDate';

function defaultNavPrevFormatter() {
    return '<';
}

function defaultNavNextFormatter() {
    return '>';
}

function defaultFullDateFormatter(date) {
    return ymd(date);
}

function createDateSwitchEl(date, props) {

    let navPrevFormatter = props.get('navPrevFormatter', defaultNavPrevFormatter);
    let navNextFormatter = props.get('navNextFormatter', defaultNavNextFormatter);
    let fullDateFormatter = props.get('fullDateFormatter', defaultFullDateFormatter);

    let el = (
        <div class="calendar__switch">
            <a class="calendar__nav calendar__nav--prev"></a>
            <a class="calendar__datecaption"></a>
            <a class="calendar__nav calendar__nav--next"></a>
        </div>
    );

    replaceContent(q(el, '.calendar__nav--prev'), navPrevFormatter());
    replaceContent(q(el, '.calendar__datecaption'), fullDateFormatter(date));
    replaceContent(q(el, '.calendar__nav--next'), navNextFormatter());

    return {
        getEl() {
            return el;
        },
        setDate(date) {
            replaceContent(q(el, '.calendar__datecaption'), fullDateFormatter(date));
        }
    }
}

export default createDateSwitchEl