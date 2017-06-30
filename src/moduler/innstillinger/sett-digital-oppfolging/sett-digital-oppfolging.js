import React from 'react';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { FormattedMessage } from 'react-intl';
import Systemtittel from 'nav-frontend-typografi/src/systemtittel';
import { AlertStripeInfoSolid } from 'nav-frontend-alertstriper';
import {
    RemoteSubmitKnapp,
    RemoteResetKnapp,
} from '../../../felles-komponenter/remote-knapp/remote-knapp';
import * as AppPt from '../../../proptypes';
import history from '../../../history';
import ModalFooter from '../../../modal/modal-footer';
import BegrunnelseForm from '../begrunnelse-form';
import { settDigitalOppfolging, lagreBegrunnelse } from '../../../ducks/situasjon';
import InnstillingerModal from '../innstillinger-modal';
import { STATUS } from '../../../ducks/utils';

const SETT_DIGITAL_FORM_NAME = 'sett-digital-form';

function SettDigitalOppfolging({
   doSettDigitalOppfolging,
    veilederId,
    doLagreBegrunnelse,
    situasjonReducer,
}) {
    const situasjonLaster =
        situasjonReducer.status === STATUS.PENDING ||
        situasjonReducer.status === STATUS.RELOADING;
    return (
        <InnstillingerModal>
            <section className="innstillinger__prosess">
                <div className="blokk-xxs">
                    <Systemtittel>
                        <FormattedMessage id="innstillinger.modal.digital.overskrift" />
                    </Systemtittel>
                </div>
                <AlertStripeInfoSolid className="blokk-xxs">
                    <FormattedMessage id="innstillinger.modal.digital.infotekst" />
                </AlertStripeInfoSolid>
                <BegrunnelseForm
                    labelId="innstillinger.modal.digital.begrunnelse"
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    onSubmit={form => {
                        doLagreBegrunnelse(form.begrunnelse);
                        return doSettDigitalOppfolging(form.begrunnelse, veilederId);
                    }}
                />
            </section>
            <ModalFooter>
                <RemoteSubmitKnapp
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    mini
                    spinner={situasjonLaster}
                    disabled={situasjonLaster}
                >
                    <FormattedMessage id="innstillinger.modal.digital.bekreft.knapp" />
                </RemoteSubmitKnapp>
                <RemoteResetKnapp
                    formNavn={SETT_DIGITAL_FORM_NAME}
                    mini
                    onClick={() => history.push('/')}
                >
                    <FormattedMessage id="innstillinger.modal.digital.avbryt.knapp" />
                </RemoteResetKnapp>
            </ModalFooter>
        </InnstillingerModal>
    );
}

SettDigitalOppfolging.defaultProps = {
    veilederId: undefined,
    situasjonReducer: undefined,
};

SettDigitalOppfolging.propTypes = {
    veilederId: PT.string,
    doSettDigitalOppfolging: PT.func.isRequired,
    doLagreBegrunnelse: PT.func.isRequired,
    situasjonReducer: AppPt.situasjon,
};

const mapStateToProps = state => ({
    veilederId: state.data.identitet.data.id,
    situasjonReducer: state.data.situasjon,
});

const mapDispatchToProps = dispatch => ({
    doSettDigitalOppfolging: (begrunnelse, veilederId) => {
        dispatch(settDigitalOppfolging(begrunnelse, veilederId))
            .then(() => history.push('/innstillinger/digital/kvittering'))
            .catch(() => history.push('/'));
    },
    doLagreBegrunnelse: begrunnelse => dispatch(lagreBegrunnelse(begrunnelse)),
});

export default connect(mapStateToProps, mapDispatchToProps)(SettDigitalOppfolging);
