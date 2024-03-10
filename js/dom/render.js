import cloneDate from '../cloneDate';
import InfinitySwipe from 'infinityswipe';
import Properties from '../properties';
import addWeeks from '../addWeeks';
import addMonths from '../addMonths';
import dayOfWeek from '../dayOfWeek';
import isHigherMonthThan from '../isHigherMonthThan';
import isLowerMonthThan from '../isLowerMonthThan';
import isSameDate from '../isSameDate';
import findMinMaxDates from '../findMinMaxDates';
import Period from '../period';
import ce from 'dom-helpers/src/ce';
import qa from 'dom-helpers/src/qa';
import remove from 'dom-helpers/src/remove';
import append from 'dom-helpers/src/append';
import get from 'dom-helpers/src/http/get';
import replaceContent from 'dom-helpers/src/replaceContent';
import clickp from 'dom-helpers/src/event/clickp';
import periodStructure from './periodStructure';
import CalendarEvents from './calendarEvents';
import defaultMonthDayFormatter from './defaultMonthDayFormatter';
import createWeekDaysEl from './createWeekDaysEl';
import createDateSwitchEl from './createDateSwitchEl';
import {ymd} from '../formatDate';
import {classNames, ClassesList} from './CssClassNames';
import {
    week as weekPeriod,
    monthWithFullWeeks as monthWithFullWeeksPeriod
} from '../createPeriod';

function render(baseDate, props) {

    this.props = new Properties(props);

    /**
     * fullDateFormatter ir pārsaukts par dateCaptionFormatter
     * metam paziņojumu consolē
     */
    if (this.props.get('fullDateFormatter')) {
        console.warn('Calendar: fullDateFormatter is renamed to dateCaptionFormatter');
    }



    // Infinity swipe reset timeout
    this.irt = 0;
    // Slides decorate timeout
    this.sdt = 0;

    this.events = new CalendarEvents([
        'dateclick',
        'periodselect',

        // Pogas next un prev click
        'prevclick',
        'nextclick',

        'datecaptionclick',

        // Ja maina mēnesi ar swipe kustību, tad izpildās tikai šis
        'slidechange',

        // Visu ielādēto slide events
        'slideschange'
    ]);

    this.cssPrefix = this.props.get('cssprefix', 'wb');

    this.state = null;
    this.stateUrl = this.props.get('stateUrl');

    let cs = classNames(this.cssPrefix);

    // Calendar dom elements
    this.el = ce(
        'div', {
            class: cs('calendar')
        }
    )
    // Date switch el
    this.dateSwitch = null;
    if (this.props.get('showDateSwitch', true)) {
        this.dateSwitch = createDateSwitchEl(cloneDate(baseDate), this.props, this.cssPrefix);
        append(this.el, this.dateSwitch.getEl());
    }
    // Weekdays
    if (this.props.get('showWeekdays', true)) {
        append(this.el, createWeekDaysEl(this.props, this.cssPrefix));
    }
    this.slidesEl = append(this.el, ce(
        'div',
        {
            class: cs('calendar-slides')
        }
    ));
    this.slideEls = append(
        this.slidesEl,
        Array(this.props.get('slidesCount', 5)).fill()
            .map(() => ce(
                'div',
                {
                    class: cs('calendar-slide')
                }
            )));

    /**
     * Šis datums tiks izmantots, lai uzstādītu slaidos datumu
     * Slaidiem ir offset no pirmā slide. Šim datuma tiks likts klāt
     * slaida offset kā mēnesis un tādā veidā zināšu
     * kādu mēnesi renderēt attiecīgajā slaidā.
     * Šim datumam nekad nevajadzētu mainīties gadam un mēnesim.
     */
    this.baseDate = cloneDate(baseDate);

    /**
     * Apmēram datums, kurš ir kalendārā.
     * Pat ja nav selected tad šis date būs
     * tas mēnesis, kurš ir redzams kalendārā
     */
    this.date = cloneDate(baseDate);

    // Vai atzīmēt šodienas datumu
    this.showToday = this.props.get('showToday', true);
    this.today = new Date();

    this.showSelectedDate = this.props.get('showSelectedDate', true);
    this.selectedDate = null;

    /**
     * Pazīme, ka klikšķinot uz datumiem tiek veidots period
     */
    this.selectPeriod = this.props.get('selectPeriod', false);
    if (this.selectPeriod) {
        this.showSelectedDate = false;
    }

    this.selectedPeriod = new Period(this.props.get('selectedPeriod', null));

    // Have user provided custom date formatter
    this.isCustomDateFormatter = true;
    // Calendar month date formatter
    this.dateFormatter = this.props.get('monthDayFormatter');
    if (!this.dateFormatter) {
        this.isCustomDateFormatter = false;
        this.dateFormatter = defaultMonthDayFormatter;
    }

    this.initInfinitySwipe();

    this.setEvents();
}

render.prototype = {
    setEvents() {

        this.infty.onSlideAdd((index, el, slide) => this.handleSlideAdd(index, el, slide));

        this.infty.onChange(() => this.handleSlideChange())
        this.infty.onSlidesChange((slides) => this.handleSlidesChange(slides))

        // Event listeners are by data attributes. To be independant of class names
        clickp(this.el, '[data-ts]', (ev, el) => this.handleDateClick(el))

        clickp(this.el, '[data-navprev]', () => this.handleDateSwitchPrevClick());
        clickp(this.el, '[data-navnext]', () => this.handleDateSwitchNextClick());
        clickp(this.el, '[data-datecaption]', () => this.handleDateSwitchCaptionClick())
    },

    initInfinitySwipe: function() {
        this.infty = new InfinitySwipe(this.slidesEl, this.slideEls, {
            positionItems: this.props.get('positionSlides', true),
            slidesPadding: this.props.get('slidesPadding', 0)
        })
    },

    handleSlideAdd(slideIndex, slideEl, slide) {

        replaceContent(slideEl, '');

        let view = this.props.get('view', 'month');
        let count = this.props.get('count', 1);

        let slideDate = this.calcIndexDateByView(view, count, slideIndex)

        slide.setData('date', cloneDate(slideDate));

        let cs = classNames(this.cssPrefix);

        let grid = append(slideEl, ce(
            'div',
            {
                class: cs('calendar-grid', 'calendar-dates')
            }
        ));

        append(grid, periodStructure(
            this.createDatesPeriodByView(view, count, slideDate)
        ));

        this.decorateSlideDates(slide);
    },

    decorateSlideDates(slide) {

        let slideDate = slide.getData('date');

        qa(slide.el, '[data-ts]').forEach(el => {
            let date = new Date(parseInt(el.dataset.ts, 10));

            /**
             * State vai nu no stateUrl vai custom set caur setState
             *
             * Te ir daži state parametri, kurus kalendārs ņems vērā
             *     disabled - vai datums ir pieejams
             *     html - month date cell html, šis tiks ielikts šūnā
             */
            let dateState = this.getDateState(date);

            let isPrevMonth = isLowerMonthThan(date, slideDate);
            let isNextMonth = isHigherMonthThan(date, slideDate);

            // Pēc noklusējuma datums nav disabled
            let isDateDisabled = false;
            if (dateState && (typeof dateState.disabled != 'undefined')) {
                isDateDisabled = dateState.disabled ? true : false;
            }

            // Prev/next month date disable
            if (this.props.get('disablePrevMonthDate') && isPrevMonth) {
                isDateDisabled = true;
            }
            if (this.props.get('disableNextMonthDate') && isNextMonth) {
                isDateDisabled = true;
            }

            // Novācam pazīmes prevmonth, nextmonth, currmonth
            delete el.dataset.prevmonth;
            delete el.dataset.nextmonth;
            delete el.dataset.currmonth;
            delete el.dataset.today;
            delete el.dataset.disabled;

            // All available modifiers
            let classes = new ClassesList(this.cssPrefix, {
                'calendar-date': true,
                'calendar--date-disabled': false,
                'calendar--wd-1': false,
                'calendar--wd-2': false,
                'calendar--wd-3': false,
                'calendar--wd-4': false,
                'calendar--wd-5': false,
                'calendar--wd-6': false,
                'calendar--wd-7': false,
                'calendar--nextmonth': false,
                'calendar--prevmonth': false,
                'calendar--today': false,
                'calendar--selected': false,
                'calendar--period-start': false,
                'calendar--period-end': false,
                'calendar--period-in': false
            })

            // Custom css class name
            if (dateState && typeof dateState.cssClass != 'undefined') {
                dateState.cssClass.split(' ').forEach(className => classes.yes(className));
            }

            classes.yes('calendar--wd-'+dayOfWeek(date));

            if (isDateDisabled) {
                classes.yes('calendar--date-disabled');

                el.dataset.disabled = 'disabled';
            }

            if (isPrevMonth) {
                classes.yes('calendar--prevmonth');

                el.dataset.prevmonth = true;
            }

            if (isNextMonth) {
                classes.yes('calendar--nextmonth');

                el.dataset.nextmonth = true;
            }

            if (this.showToday) {
                if (isSameDate(date, this.today)) {
                    classes.yes('calendar--today');

                    el.dataset.today = true;
                }
            }

            if (this.showSelectedDate) {
                if (this.selectedDate && isSameDate(date, this.selectedDate)) {
                    classes.yes('calendar--selected');
                }
            }

            // Selected period
            if (this.selectedPeriod.isStart(date)) {
                classes.yes('calendar--period-start');
            }

            if (this.selectedPeriod.isEnd(date)) {
                classes.yes('calendar--period-end');
            }

            if (this.selectedPeriod.isIn(date)) {
                classes.yes('calendar--period-in');
            }

            let contentEl = el.childNodes.length > 0 ? el.childNodes[0] : null;


            let isStateHtml = false;
            if (dateState && (typeof dateState.html != 'undefined')) {
                isStateHtml = true;
            }

            let newContentEl;
            // Ja ir user definēts formatter, tad tas ir galvenais
            if (this.isCustomDateFormatter || !isStateHtml) {
                // Ja bija custom html un tagad vairs nav html, tad padoda null, lai dateFormatter izveido jaunu content
                if (el.dataset.isHtml) {
                    newContentEl = this.dateFormatter(cloneDate(date), null, dateState);
                }
                else {
                    newContentEl = this.dateFormatter(cloneDate(date), contentEl, dateState);
                }
                if (newContentEl) {
                    replaceContent(el, newContentEl);
                }
                delete el.dataset.isHtml;
            }
            else {
                el.dataset.isHtml = 'yes';
                el.innerHTML = dateState.html;
            }



            el.className = classes.className();
        })
    },

    handleDateSwitchPrevClick() {
        this.infty.prevSlide();

        this.events.fire('prevclick', []);
    },

    handleDateSwitchNextClick() {
        this.infty.nextSlide();

        this.events.fire('nextclick', []);
    },

    handleDateSwitchCaptionClick() {
        this.events.fire('datecaptionclick', []);
    },

    handleDateClick(dateEl) {

        // Vai ir disabled
        if (dateEl.dataset.disabled == 'disabled') {
            return;
        }

        let date = new Date(parseInt(dateEl.dataset.ts, 10));

        if (this.selectPeriod) {

            if (this.selectedPeriod.hasFullPeriod()) {
                this.selectedPeriod.from = date;
                this.selectedPeriod.till = null;
            }
            else if (!this.selectedPeriod.hasPeriodFrom()) {
                this.selectedPeriod.from = date;
            }
            else if (!this.selectedPeriod.hasPeriodTill()) {
                this.selectedPeriod.till = date;
            }

            this.selectedPeriod.swapIfMissOrdered();

        }
        else {
            this.selectedDate = date;
            this.date = cloneDate(this.selectedDate);
        }

        /**
         * Ja uzklišķināts uz prev/next
         * mēneša datuma, tad vajag pārslēgt
         * uz attiecīgo mēnesi. Šo darām tikai view=month
         */
        let changeSlide = false;
        if (this.props.get('view') == 'month') {
            changeSlide = true;
        }

        if (changeSlide) {
            // Pārbaudām vai vajag pārslēgties uz prev/next mēnesi
            if (dateEl.dataset.prevmonth) {
                setTimeout(() => this.infty.prevSlide(), 2);
            }
            else if (dateEl.dataset.nextmonth) {
                setTimeout(() => this.infty.nextSlide(), 2)
            }
        }

        this.refresh();

        // Period mode
        if (this.selectPeriod) {
            if (this.selectedPeriod.hasFullPeriod()) {
                this.events.fire('periodselect', [this.selectedPeriod.toObj()])
            }
        }
        // Single date mode
        else {
            this.events.fire('dateclick', [cloneDate(this.selectedDate)])
        }
    },

    handleSlideChange() {
        let slide = this.infty.getCurrent();

        this.date = cloneDate(slide.getData('date'));
        if (this.dateSwitch) {
            this.dateSwitch.setDate(cloneDate(slide.getData('date')));
        }

        this.events.fire('slidechange', [cloneDate(slide.getData('date'))]);
    },

    /**
     * Tad, kad ir noformēti visi ielādētie kalendāru slides, tad
     * palaižam event un tajā padodam visus ielādēto kalendāru mēnešus
     */
    handleSlidesChange(slides) {
        let dates = slides.map(slide => slide.getData('date'));

        if (this.stateUrl) {
            this.loadStateFromUrl(dates)
        }

        this.events.fire('slideschange', [dates]);
    },

    getDateState(date) {
        let defaultDateState = this.props.get('defaultDateState');
        if (!this.state) {
            if (defaultDateState) {
                return defaultDateState;
            }
            return undefined;
        }

        let dateState = this.state[ymd(date)];

        if (dateState) {
            return dateState;
        }

        if (defaultDateState) {
            return defaultDateState;
        }

        return undefined;
    },

    /**
     * Ja ir uzlikts stateUrl, tad ielādējam datumu statusu no šī url
     */
    loadStateFromUrl(dates) {
        let period = findMinMaxDates(dates)

        get(this.stateUrl, {
            from: ymd(period.min),
            till: ymd(period.max)
        })
            .then(state => this.setState(state))
    },

    /**
     * Aprēķinām datumu pēc padotā slide index
     * Ņemam base date un liekam klāt datumu pēc padotā slideIndex
     */
    calcIndexDateByView(view, count, slideIndex) {
        switch (view) {
            case 'week':
                return addWeeks(this.baseDate, count*slideIndex);
            case 'month':
                return addMonths(this.baseDate, count*slideIndex);
        }
    },

    createDatesPeriodByView(view, count, baseDate) {
        // Period creator
        switch (view) {
            case 'week':
                return weekPeriod(baseDate, count);
            case 'month':
                /**
                 * ja ir mēnesis, tad pirmo un pēdējo
                 * nedēļu vajag papildināt ar iepriekšējā un
                 * nākošā mēneša dienām, lai izveidojas pilnas nedēļas
                 */
                return monthWithFullWeeksPeriod(baseDate, count);
        }
    },

    getEl() {
        return this.el;
    },

    on(eventName, cb) {
        this.events.on(eventName, cb);
    },

    /**
     * Uzstāda datuma state
     * State ir key => value objekts, kur key ir datums Y-m-d
     * value varbūt jebkas. Value tiks padots uz monthDayFormatter
     * Pats calendar value neizmanto
     */
    setState(state) {
        this.state = state;

        this.refresh();
    },

    setDateState(date, state) {
        let k = typeof date == 'object' ? ymd(date) : date;

        if (!this.state) {
            this.state = {};
        }
        this.state[k] = state;
    },

    /**
     * Uzstāda state url
     * Vai arī noņem, ja padots tukšums
     */
    setStateUrl(stateUrl) {
        if (this.stateUrl == stateUrl) {
            return;
        }

        this.stateUrl = stateUrl;

        // Notīrām state
        this.state = null;

        if (this.stateUrl) {
            this.loadStateFromUrl(this.infty.getSlides().slides.map(slide => slide.getData('date')))
        }
        else {
            this.refresh();
        }
    },

    setDate(date) {
        this.date = cloneDate(date);
        if (this.dateSwitch) {
            this.dateSwitch.setDate(cloneDate(this.date));
        }

        this.baseDate = cloneDate(date);

        /**
         * Ja izsauc uzreiz pēc calendar instances izveidošanas, tad vēl
         * nav pieejams infinity.slides un ir error
         * Tagad domāju, ka varbūt vispār vajag uzlikt throttle uz restart.
         * Ja nu notiek ciklā izsaukšanas setDate, tad uz katru tiks izsaukts restart
         */
        clearTimeout(this.irt);
        this.irt = setTimeout(() => this.infty.restart(), 10);

    },

    setSelectedDate(date) {
        this.selectedDate = cloneDate(date);

        this.setDate(cloneDate(this.selectedDate));
    },

    setSelectedPeriod(period) {
        this.selectedPeriod = new Period(period);

        this.refresh();
    },

    /**
     * Period select režīms
     *     true - būs period select režīms
     *     false - nebūs period select režīms
     */
    setSelectPeriod(state) {
        this.selectPeriod = state;

        if (this.selectPeriod) {
            this.showSelectedDate = false;
        }
        else {
            this.showSelectedDate = true;
            this.selectedPeriod = new Period(null);
        }

        this.refresh();
    },


    getDate() {
        return cloneDate(this.date);
    },

    getSelectedDate() {
        return this.selectedDate ? cloneDate(this.selectedDate) : null;
    },

    getSelectedPeriod() {
        return this.selectedPeriod.toObj();
    },

    refresh() {
        // Redecorate all slides
        clearTimeout(this.sdt);
        this.sdt = setTimeout(() => this.infty.getSlides().slides.forEach(slide => this.decorateSlideDates(slide)), 10);
    },

    destroy() {
        // remove all event listenrs
        //this.setEvents('remove');

        if (this.el) {
            remove(this.el);
            delete this.el;
        }
    }
}

export default render;