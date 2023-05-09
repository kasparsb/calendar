import dom from './dom/render2';

import periodStructure from './periodStructure';
import {
    week as weekPeriod,
    month as monthPeriod,
    monthWithFullWeeks as monthWithFullWeeksPeriod
} from './createPeriod';


export {
    weekPeriod,
    monthPeriod,
    monthWithFullWeeksPeriod,

    periodStructure,

    dom
}

// export default {
//     //dom: domRender,

//     periodStructure: periodStructure
// }