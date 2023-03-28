import PT from 'prop-types';
import React from 'react';
import { BrowserRouter, HashRouter, Route, Routes } from 'react-router-dom';

import { AKTIVITETSPLAN_ROOT_NODE_ID } from './constant';
import Timeoutbox from './felles-komponenter/timeoutbox/timeoutbox';
import Hovedside from './hovedside/Hovedside';
import AvbrytAktivitet from './moduler/aktivitet/avslutt/AvbrytAktivitet';
import FullforAktivitet from './moduler/aktivitet/avslutt/FullforAktivitet';
import LeggTilForm from './moduler/aktivitet/ny-aktivitet/LeggTilForm';
import NyAktivitetForm from './moduler/aktivitet/ny-aktivitet/ny-aktivitet-form';
import EndreAktivitet from './moduler/aktivitet/rediger/EndreAktivitet';
import AktivitetvisningContainer from './moduler/aktivitet/visning/AktivitetvisningContainer';
import InformasjonModal from './moduler/informasjon/informasjon-modal';
import Aktivitetsmal from './moduler/mal/mal';
import AktivitetsplanPrint from './moduler/utskrift/AktivitetsplanPrint';
import Provider from './Provider';
import { UpdateEventHandler } from './utils/UpdateHandler';
import { HiddenIf, getContextPath } from './utils/utils';

function isValueOrGetDefault(value: any, defaultValue: any) {
    return value === undefined ? defaultValue : value;
}

export interface AppConfig {
    CONTEXT_PATH: string;
    TILLAT_SET_AVTALT: boolean;
    VIS_MALER: boolean;
    TIMEOUTBOX: boolean;
}

declare const window: {
    appconfig: AppConfig;
};

// NOTE: This is bad, don't use it if you dont HAVE to.
window.appconfig = window.appconfig || {};
const path = window.appconfig.CONTEXT_PATH === '' ? '' : getContextPath();
window.appconfig = {
    CONTEXT_PATH: path,
    TILLAT_SET_AVTALT: isValueOrGetDefault(window.appconfig.TILLAT_SET_AVTALT, true),
    VIS_MALER: isValueOrGetDefault(window.appconfig.VIS_MALER, true),
    TIMEOUTBOX: isValueOrGetDefault(window.appconfig.TIMEOUTBOX, false),
};

const getBasename = (fnr: string) => {
    const pathnamePrefix = import.meta.env.BASE_URL;
    if (fnr && !pathnamePrefix) {
        return fnr;
    } else if (fnr && pathnamePrefix) {
        return `${pathnamePrefix}/${fnr}`.replace('/', ''); // Replace prepending slash
    } else if (pathnamePrefix) {
        return pathnamePrefix;
    } else {
        return undefined;
    }
};

const Router = ({ fnr, children }: { fnr: string; children: React.ReactNode }) => {
    if (import.meta.env.VITE_USE_HASH_ROUTER === 'true') {
        return <HashRouter basename={fnr}>{children}</HashRouter>;
    }

    const basename = getBasename(fnr);
    return <BrowserRouter basename={basename}>{children}</BrowserRouter>;
};

function App({ fnr }: { fnr: string }) {
    return (
        <div className="aktivitetsplanfs" id={AKTIVITETSPLAN_ROOT_NODE_ID}>
            <Provider key={fnr}>
                <div className="aktivitetsplan-wrapper">
                    <div className="fullbredde">
                        <Router fnr={fnr}>
                            <Routes>
                                <Route path="/utskrift" element={<AktivitetsplanPrint />} />
                                <Route path="/" element={<Hovedside />}>
                                    <Route path={'/mal'} element={<Aktivitetsmal />} />
                                    <Route path={'/informasjon'} element={<InformasjonModal />} />
                                    <Route path={'/aktivitet'}>
                                        <Route path={`ny`} element={<LeggTilForm />} />
                                        <Route path={`ny/*`} element={<NyAktivitetForm />} />
                                        <Route path={`vis/:id`} element={<AktivitetvisningContainer />} />
                                        <Route path={`endre/:id`} element={<EndreAktivitet />} />
                                        <Route path={`avbryt/:id`} element={<AvbrytAktivitet />} />
                                        <Route path={`fullfor/:id`} element={<FullforAktivitet />} />
                                    </Route>
                                </Route>
                            </Routes>
                        </Router>
                        <HiddenIf hidden={!window.appconfig.TIMEOUTBOX}>
                            <Timeoutbox />
                        </HiddenIf>
                    </div>
                </div>
                <UpdateEventHandler />
            </Provider>
        </div>
    );
}

App.propTypes = {
    fnr: PT.string,
};

App.defaultProps = {
    fnr: undefined,
};

export default App;
