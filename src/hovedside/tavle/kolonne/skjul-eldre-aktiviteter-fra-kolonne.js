import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { VisibleIfLesmerpanel } from '../../../felles-komponenter/utils/visible-if-lesmerpanel';
import { selectErVeileder } from '../../../moduler/identitet/identitet-selector';
import loggEvent from '../../../felles-komponenter/utils/logging';
import AktivitetsKort from '../../../moduler/aktivitet/aktivitet-kort/aktivitetskort';

const LOGGING_VISELDREAKITIVITETER = 'aktivitetsplan.viseldreaktiviter';
const LOGGING_SKJULELDREAKTIVITETER = 'aktivitetsplan.skjuleldreaktiviter';

// eslint-disable-next-line no-unused-vars
function loggingAvSkjulEldreAktiviteter(event, typeEvent, hvem) {
    loggEvent(typeEvent, hvem);
}

function lagAktivitetsListe(aktiviteter) {
    return aktiviteter.map(aktivitet =>
        <AktivitetsKort key={aktivitet.id} aktivitet={aktivitet} />
    );
}

function SkjulEldreAktiviteter({
    aktiviteteterTilDatoMerEnnToManederSiden,
    erVeileder,
}) {
    const visible = aktiviteteterTilDatoMerEnnToManederSiden.length > 0;
    return (
        <VisibleIfLesmerpanel
            visible={visible}
            className="aktivitetstavle__kolonne-lesmerpanel"
            onOpen={event =>
                loggingAvSkjulEldreAktiviteter(
                    event,
                    LOGGING_VISELDREAKITIVITETER,
                    { erVeileder }
                )}
            onClose={event =>
                loggingAvSkjulEldreAktiviteter(
                    event,
                    LOGGING_SKJULELDREAKTIVITETER,
                    { erVeileder }
                )}
            apneTekst="Vis kort eldre enn en måned"
            lukkTekst="Skjul kort eldre enn en måned"
        >
            {lagAktivitetsListe(aktiviteteterTilDatoMerEnnToManederSiden)}
        </VisibleIfLesmerpanel>
    );
}

const mapStateToProps = state => ({
    erVeileder: selectErVeileder(state),
});

SkjulEldreAktiviteter.propTypes = {
    aktiviteteterTilDatoMerEnnToManederSiden: PT.arrayOf(PT.object).isRequired,
    erVeileder: PT.bool.isRequired,
};

export default connect(mapStateToProps)(SkjulEldreAktiviteter);
