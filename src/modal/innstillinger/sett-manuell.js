import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Systemtittel from 'nav-frontend-typografi/src/systemtittel';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import { RemoteSubmitKnapp, RemoteResetKnapp } from './remote-knapp';
import * as AppPt from '../../proptypes';
import history from '../../history';
import ModalFooter from '../modal-footer';
import BegrunnelseForm from './begrunnelse-form';
import { settManuell, lagreBegrunnelse } from '../../ducks/situasjon';
import InnstillingerModal from '../innstillinger/innstillinger-modal';
import { STATUS } from '../../ducks/utils';

const SETT_MANUELL_FORM_NAME = 'sett-manuell-form';

function SettManuell({
    doSettManuell,
    veilederId,
    doLagreBegrunnelse,
    situasjonReducer,
}) {
    const situasjonLaster =
        situasjonReducer.status === STATUS.PENDING ||
        situasjonReducer.status === STATUS.RELOADING;
    return (
        <InnstillingerModal>
            <section className="innstillinger__sett-manuell">
                <Systemtittel>
                    <FormattedMessage id="innstillinger.modal.manuell.overskrift" />
                </Systemtittel>
                <div className="blokk-xxs">
                    <AlertStripeInfoSolid>
                        <FormattedMessage id="innstillinger.modal.manuell.infotekst" />
                    </AlertStripeInfoSolid>
                </div>
                <BegrunnelseForm
                    labelId="innstillinger.modal.manuell.begrunnelse"
                    formNavn={SETT_MANUELL_FORM_NAME}
                    onSubmit={form => {
                        doLagreBegrunnelse(form.begrunnelse);
                        return doSettManuell(form.begrunnelse, veilederId);
                    }}
                />
            </section>
            <ModalFooter>
                <RemoteSubmitKnapp
                    formNavn={SETT_MANUELL_FORM_NAME}
                    mini
                    spinner={situasjonLaster}
                    disabled={situasjonLaster}
                >
                    <FormattedMessage id="innstillinger.modal.manuell.bekreft.knapp" />
                </RemoteSubmitKnapp>
                <RemoteResetKnapp
                    formNavn={SETT_MANUELL_FORM_NAME}
                    mini
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.manuell.avbryt.knapp" />
                </RemoteResetKnapp>
            </ModalFooter>
        </InnstillingerModal>
    );
}

SettManuell.defaultProps = {
    veilederId: undefined,
    situasjonReducer: undefined,
};

SettManuell.propTypes = {
    veilederId: PT.string,
    doSettManuell: PT.func.isRequired,
    doLagreBegrunnelse: PT.func.isRequired,
    situasjonReducer: AppPt.situasjon,
};

const mapStateToProps = state => ({
    veilederId: state.data.identitet.data.id,
    situasjonReducer: state.data.situasjon,
});

const mapDispatchToProps = dispatch => ({
    doSettManuell: (begrunnelse, veilederId) => {
        dispatch(settManuell(begrunnelse, veilederId))
            .then(() => history.push('/innstillinger/manuell/kvittering'))
            .catch(() => history.push('/'));
    },
    doLagreBegrunnelse: begrunnelse => dispatch(lagreBegrunnelse(begrunnelse)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettManuell);
