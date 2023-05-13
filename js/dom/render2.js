import cloneDate from '../cloneDate';
import InfinitySwipe from 'infinityswipe';
import Properties from '../properties';
import addWeeks from '../addWeeks';
import addMonths from '../addMonths';
import dayOfWeek from '../dayOfWeek';
import isHigherMonthThan from '../isHigherMonthThan';
import isLowerMonthThan from '../isLowerMonthThan';
import isSameDate from '../isSameDate';
import Period from '../period';
import {jsx, qa, remove, append, replaceContent, hasClass, clickp} from 'dom-helpers';
import {
    week as weekPeriod,
    monthWithFullWeeks as monthWithFullWeeksPeriod
} from '../createPeriod';
import periodStructure from './periodStructure';
import CalendarEvents from './calendarEvents';
import defaultMonthDayFormatter from './defaultMonthDayFormatter';
import createWeekDaysEl from './createWeekDaysEl';
import createDateSwitchEl from './createDateSwitchEl';
import {ymd} from '../formatDate';

function render(baseDate, props) {

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

    this.props = new Properties(props);

    this.state = null;

    // Calendar dom elements
    this.el = <div class="calendar"></div>
    // Date switch el
    this.dateSwitch = null;
    if (this.props.get('showDateSwitch', true)) {
        this.dateSwitch = createDateSwitchEl(cloneDate(baseDate), this.props);
        append(this.el, this.dateSwitch.getEl());
    }
    // Weekdays
    if (this.props.get('showWeekdays', true)) {
        append(this.el, createWeekDaysEl(this.props));
    }
    this.slidesEl = append(this.el, <div class="calendar__slides"></div>);
    this.slideEls = append(this.slidesEl, Array(this.props.get('slidesCount', 5)).fill().map(() => <div class="calendar__slide"></div>));

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

    this.initInfinitySwipe();

    this.setEvents();
}

render.prototype = {
    setEvents() {

        this.infty.onSlideAdd((index, el, slide) => this.handleSlideAdd(index, el, slide));

        this.infty.onChange(() => this.handleSlideChange())
        this.infty.onSlidesChange((slides) => this.handleSlidesChange(slides))

        clickp(this.el, '.calendar__date', (ev, el) => this.handleDateClick(el))

        clickp(this.el, '.calendar__nav--prev', () => this.handleDateSwitchPrevClick());
        clickp(this.el, '.calendar__nav--next', () => this.handleDateSwitchNextClick());
        clickp(this.el, '.calendar__datecaption', () => this.handleDateSwitchCaptionClick())
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

        append(slideEl, periodStructure(
            this.createDatesPeriodByView(view, count, slideDate)
        ));

        this.decorateSlideDates(slide);
    },

    decorateSlideDates(slide) {

        let slideDate = slide.getData('date');

        qa(slide.el, '[data-ts]').forEach(el => {
            let date = new Date(parseInt(el.dataset.ts, 10));

            let classes = [
                'calendar__date',
                'calendar__date--wd-'+dayOfWeek(date)
            ];

            if (isHigherMonthThan(date, slideDate)) {
                classes.push('calendar__date--nextmonth');
            }

            if (isLowerMonthThan(date, slideDate)) {
                classes.push('calendar__date--prevmonth');
            }

            if (this.showToday) {
                if (isSameDate(date, this.today)) {
                    classes.push('calendar__date--today');
                }
            }

            if (this.showSelectedDate) {
                if (this.selectedDate && isSameDate(date, this.selectedDate)) {
                    classes.push('calendar__date--selected');
                }
            }

            // Selected period
            if (this.selectedPeriod.isStart(date)) {
                classes.push('calendar__date--period-start');
            }

            if (this.selectedPeriod.isEnd(date)) {
                classes.push('calendar__date--period-end');
            }

            if (this.selectedPeriod.isIn(date)) {
                classes.push('calendar__date--period-in');
            }


            // Formatter
            let dateFormatter = this.props.get('monthDayFormatter');
            if (!dateFormatter) {
                dateFormatter = defaultMonthDayFormatter;
            }

            let contentEl = el.childNodes.length > 0 ? el.childNodes[0] : null;

            /**
             * @todo šeit līdzi jāpadod konkrētā datuma state, kāds nu tas
             * ir uzlikts state uzliek enduser. Vai objekts vai kāda cita vērtība
             */
            let newContentEl = dateFormatter(cloneDate(date), contentEl, this.getDateState(date));
            if (newContentEl) {
                replaceContent(el, newContentEl);
            }


            el.className = classes.join(' ');
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
            if (hasClass(dateEl, 'calendar__date--prevmonth')) {
                setTimeout(() => this.infty.prevSlide(), 2);
            }
            else if (hasClass(dateEl, 'calendar__date--nextmonth')) {
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
        this.events.fire('slideschange', [
            slides.map(slide => slide.getData('date'))
        ]);
    },

    getDateState(date) {
        if (!this.state) {
            return undefined;
        }

        let k = ymd(date);
        return this.state[k];
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

    setDate(date) {
        this.date = cloneDate(date);
        if (this.dateSwitch) {
            this.dateSwitch.setDate(cloneDate(this.date));
        }

        this.baseDate = cloneDate(date);

        this.infty.restart();
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
        this.infty.getSlides().slides.forEach(slide => this.decorateSlideDates(slide))
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