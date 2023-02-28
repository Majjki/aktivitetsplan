import { fireEvent, render, screen } from '@testing-library/react';
import { setupServer } from 'msw/node';
import { Provider } from 'react-redux';
import { MemoryRouter } from 'react-router-dom';
import { Store } from 'redux';

import { STATUS } from '../../../api/utils';
import { STATUS_GJENNOMFOERT } from '../../../constant';
import { AlleAktiviteter, StillingFraNavSoknadsstatus, StillingsStatus } from '../../../datatypes/aktivitetTypes';
import { VeilarbAktivitetType } from '../../../datatypes/internAktivitetTypes';
import Hovedside from '../../../hovedside/Hovedside';
import { wrapAktivitet } from '../../../mocks/aktivitet';
import { mockOppfolging } from '../../../mocks/data/oppfolging';
import { enStillingFraNavAktivitet } from '../../../mocks/fixtures/stillingFraNavFixtures';
import { handlers } from '../../../mocks/handlers';
import reducer, { State } from '../../../reducer';
import create from '../../../store';
import { aktivitetTypeMap, stillingsEtikettMapper } from '../../../utils/textMappers';
import { HENT_AKTIVITET_OK } from '../../aktivitet/aktivitet-action-types';

const identitet = {
    id: 'Z123456',
    erVeileder: true,
    erBruker: false,
};

const initialStore = {
    ...reducer({} as any, { type: 'INITAL' }),
    data: {
        aktiviteter: {
            status: STATUS.OK,
            data: [],
        },
        arenaAktiviteter: {
            status: STATUS.OK,
            data: [],
        },
        oppfolging: {
            status: STATUS.OK,
            data: mockOppfolging,
        },
        identitet: {
            status: STATUS.OK,
            data: identitet,
        },
        feature: {
            status: STATUS.OK,
            data: { ignore: false },
        },
    },
} as State;

/* Provider both redux-store and "in-memory" router for all sub-components to render correctly */
const WrappedHovedside = ({ store }: { store: Store }) => {
    return (
        <Provider store={store}>
            <MemoryRouter>
                <Hovedside />
            </MemoryRouter>
        </Provider>
    );
};

let id = 12012;
const exampleAktivitet = wrapAktivitet({
    ...enStillingFraNavAktivitet({ tittel: 'Servitør', arstall: 2017 }),
    arbeidsgiver: 'Arbeidsgiver',
    status: STATUS_GJENNOMFOERT,
});
function makeTestAktiviteter<T>(
    store: Store,
    filterValues: T[],
    valueSetter: (aktivitet: AlleAktiviteter, value: T) => AlleAktiviteter
) {
    const testAktiviteter = filterValues.map((filterValue) => {
        id += 1;
        return {
            ...valueSetter(exampleAktivitet, filterValue),
            id,
            tittel: `Aktivitet: ${filterValue}`,
        };
    });
    store.dispatch({
        type: HENT_AKTIVITET_OK,
        data: testAktiviteter,
    });
    return testAktiviteter.map(({ tittel, type }) => ({ tittel, type }));
}

const server = setupServer(...handlers);

describe('aktivitets-filter', () => {
    // Start server before all tests
    beforeAll(() => server.listen({ onUnhandledRequest: 'error' }));

    //  Close server after all tests
    afterAll(() => server.close());

    // Reset handlers after each test `important for test isolation`
    afterEach(() => server.resetHandlers());

    const clickOnFilter = (filterName: string) => {
        fireEvent.click(screen.getByText('Filtrer'));
        fireEvent.click(screen.getByText(filterName));
    };
    const clickOnFirst = (filterName: string) => {
        fireEvent.click(screen.getByText('Filtrer'));
        fireEvent.click(screen.queryAllByText(filterName)[0]);
    };

    it('should filter avtalt med nav', async () => {
        const store = create(initialStore);
        const { getByLabelText, getByText, queryByText } = render(<WrappedHovedside store={store} />);
        makeTestAktiviteter(store, [true, false], (aktivitet, value) => {
            return {
                ...aktivitet,
                avtalt: value,
            };
        });
        // clickOnFilter('Ikke avtalt med NAV');
        fireEvent.click(getByText('Filtrer'));
        fireEvent.click(getByLabelText('Ikke avtalt med NAV'));
        screen.getByRole('checkbox', { name: 'Ikke avtalt med NAV', checked: true });

        getByText('Aktivitet: false');
        expect(queryByText('Aktivitet: true')).toBeFalsy();
        // expect(queryByText('Aktivitet: true')).toBeNull();
        // fireEvent.click(getByText('Filtrer'));
        fireEvent.click(getByText('Avtalt med NAV'));
        fireEvent.click(getByText('Ikke avtalt med NAV'));
        getByText('Aktivitet: true');
        expect(queryByText('Aktivitet: false')).toBeFalsy();
        expect(queryByText('Assisterende skipskokk')).toBeNull();
    });

    it.skip('should filter on aktivitet type', async () => {
        const aktivitetTyper = [
            VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE,
            VeilarbAktivitetType.MOTE_TYPE,
            VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
        ];
        const store = create(initialStore);
        render(<WrappedHovedside store={store} />);
        const aktiviteter = makeTestAktiviteter<VeilarbAktivitetType>(store, aktivitetTyper, (aktivitet, value) => {
            return {
                ...aktivitet,
                type: value,
            } as AlleAktiviteter;
        }) as {
            tittel: string;
            type:
                | VeilarbAktivitetType.BEHANDLING_AKTIVITET_TYPE
                | VeilarbAktivitetType.MOTE_TYPE
                | VeilarbAktivitetType.STILLING_AKTIVITET_TYPE;
        }[];
        aktiviteter.forEach(({ tittel, type }) => {
            fireEvent.click(screen.getByText('Filtrer'));
            fireEvent.click(screen.queryAllByText(aktivitetTypeMap[type])[0]);
            screen.getByText(tittel);
            // Sjekk at ingen andre aktiviteter vises
            aktivitetTyper
                .filter((andreTyper) => andreTyper != type)
                .forEach((typeSomIkkeSkalFinnes) => {
                    expect(screen.queryByText(`Aktivitet: ${typeSomIkkeSkalFinnes}`)).toBeNull();
                });
            // Turn filter off
            fireEvent.click(screen.getByText('Filtrer'));
            fireEvent.click(screen.queryAllByText(aktivitetTypeMap[type])[0]);
        });
    });

    it.skip('Should filter based on etiketter (stilling fra NAV)', () => {
        const store = create(initialStore);
        render(<WrappedHovedside store={store} />);
        const statuser: StillingFraNavSoknadsstatus[] = ['AVSLAG', 'VENTER'];
        makeTestAktiviteter(store, statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                stillingFraNavData: {
                    ...aktivitet.stillingFraNavData,
                    soknadsstatus: value,
                },
            } as AlleAktiviteter;
        });
        screen.getByText(`Aktivitet: VENTER`);
        screen.getByText(`Aktivitet: AVSLAG`);
        clickOnFirst(stillingsEtikettMapper['AVSLAG']);
        expect(screen.getByText(`Aktivitet: AVSLAG`)).not.toBeNull();
        expect(screen.queryByText(`Aktivitet: SOKNAD_SENDT`)).toBeNull();
        fireEvent.click(screen.getByText('Filtrer'));
    });

    it.skip('Should filter based on etiketter (stilling)', () => {
        const store = create(initialStore);
        render(<WrappedHovedside store={store} />);
        const statuser: StillingsStatus[] = ['INNKALT_TIL_INTERVJU', 'SOKNAD_SENDT'];
        makeTestAktiviteter(store, statuser, (aktivitet, value) => {
            return {
                ...aktivitet,
                etikett: value,
                type: VeilarbAktivitetType.STILLING_AKTIVITET_TYPE,
            } as AlleAktiviteter;
        });
        screen.getByText(`Aktivitet: INNKALT_TIL_INTERVJU`);
        screen.getByText(`Aktivitet: SOKNAD_SENDT`);
        clickOnFirst(stillingsEtikettMapper['INNKALT_TIL_INTERVJU']);
        expect(screen.getByText(`Aktivitet: INNKALT_TIL_INTERVJU`)).not.toBeNull();
        expect(screen.queryByText(`Aktivitet: SOKNAD_SENDT`)).toBeNull();
    });
});
