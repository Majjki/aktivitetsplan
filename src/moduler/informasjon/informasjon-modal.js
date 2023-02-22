import { Accordion, BodyShort, Heading, Link } from '@navikt/ds-react';
import PT from 'prop-types';
import React, { Component } from 'react';
import { connect } from 'react-redux';

import * as Api from '../../api/lestAPI';
import Modal from '../../felles-komponenter/modal/Modal';
import ModalContainer from '../../felles-komponenter/modal/ModalContainer';
import * as AppPT from '../../proptypes';
import { selectErBruker } from '../identitet/identitet-selector';
import { selectLestInformasjon } from '../lest/lest-reducer';
import { selectErUnderOppfolging } from '../oppfolging-status/oppfolging-selector';
import { BrukePlanenPanel } from './brukePlanenPanel';
import styles from './informasjon-modal.module.less';
import { selectBackPath, setBackPath } from './informasjon-reducer';
import { OkonomiskStotte } from './okonomiskStottePanel';
import { RettigheterPanel } from './rettigheterPanel';
import Video from './video';

export const INFORMASJON_MODAL_VERSJON = 'v1';

class InformasjonModal extends Component {
    componentDidMount() {
        const { erBruker, underOppfolging, lestInfo } = this.props;

        if (erBruker && underOppfolging && (!lestInfo || lestInfo.verdi !== INFORMASJON_MODAL_VERSJON)) {
            Api.postLest(INFORMASJON_MODAL_VERSJON);
        }
    }

    render() {
        const { resetBackPath, backPath, history } = this.props;

        return (
            <Modal
                contentLabel="informasjon-modal"
                className="informasjon-visning"
                onRequestClose={() => {
                    resetBackPath();
                    history.push(backPath);
                }}
            >
                <ModalContainer className="informasjon-modal-container max-w-2xl p-6">
                    <Heading level="2" size="small" className={styles.innholdsTittel}>
                        Hva er aktivitetsplanen?
                    </Heading>
                    <BodyShort className={styles.avsnitt}>
                        I aktivitetsplanen holder du oversikt over det du gjør for å komme i jobb eller annen aktivitet.
                        Både du og veilederen din kan se og endre aktivitetsplanen.
                    </BodyShort>
                    <BodyShort>
                        Du kan legge inn målet ditt, aktiviteter du skal gjøre og stillinger du vil søke på. Veilederen
                        kan blant annet legge inn forslag til aktiviteter eller skrive referat fra et møte dere har
                        hatt. Du kan kommunisere med veilederen din om aktivitetene i{' '}
                        <Link href={process.env.REACT_APP_ARBEIDSRETTET_DIALOG_URL}>dialogen</Link>.
                    </BodyShort>
                    <Accordion className="mt-4">
                        <BrukePlanenPanel />
                        <OkonomiskStotte />
                        <RettigheterPanel />
                    </Accordion>
                    <Video />
                </ModalContainer>
            </Modal>
        );
    }
}

InformasjonModal.defaultProps = {
    lestInfo: null,
    erBruker: false,
    underOppfolging: false,
    backPath: '/',
};

InformasjonModal.propTypes = {
    erBruker: PT.bool,
    underOppfolging: PT.bool,
    lestInfo: AppPT.lest,
    resetBackPath: PT.func.isRequired,
    backPath: PT.string,
    history: AppPT.history.isRequired,
};

const mapStateToProps = (state) => ({
    lestInfo: selectLestInformasjon(state),
    erBruker: selectErBruker(state),
    underOppfolging: selectErUnderOppfolging(state),
    backPath: selectBackPath(state),
});

const mapDispatchToProps = (dispatch) => ({
    resetBackPath: () => dispatch(setBackPath('/')),
});

export default connect(mapStateToProps, mapDispatchToProps)(InformasjonModal);
