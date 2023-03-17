import 'moment-timezone';
import 'moment/locale/nb';
import 'whatwg-fetch';

import Adapter from '@wojtekmaj/enzyme-adapter-react-17';
import { configure } from 'enzyme';
import moment from 'moment';

moment.locale('nb');
moment.tz.setDefault('Europe/Oslo');
moment.updateLocale('nb', {
    monthsShort: ['jan', 'feb', 'mar', 'apr', 'mai', 'jun', 'jul', 'aug', 'sep', 'okt', 'nov', 'des'],
});

configure({ adapter: new Adapter() });

// Ikkje bra!
import.meta.env.BASE_URL = 'http://localhost:3000'; // Dette er det som ligger på window.location i jsdom

window.IntersectionObserver = vi.fn();
// Mocked because react-dnd uses es6 import and have to be transpiled to work in these tests
vi.mock('react-dnd', () => ({
    useDrag: () => {
        let ref = null;
        return [{}, ref];
    },
    useDrop: () => {
        let ref = null;
        return [{}, ref];
    },
    DndProvider: ({ children }) => <>{children}</>,
}));
vi.mock('react-dnd-html5-backend', () => ({}));
vi.mock('react-intl', () => ({
    FormattedMessage: ({ id }) => id,
}));
