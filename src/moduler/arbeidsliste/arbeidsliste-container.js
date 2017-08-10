import React from 'react';
import { bindActionCreators } from 'redux';
import { connect } from 'react-redux';
import PT from 'prop-types';
import { Route, Switch, withRouter } from 'react-router-dom';
import * as AppPT from '../../proptypes';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import {
    selectMotpartReducer,
    selectNavnPaMotpart,
} from '../motpart/motpart-selector';
import StandardModal from '../../felles-komponenter/modal/modal-standard';
import ModalHeader from '../../felles-komponenter/modal/modal-header';
import { getFodselsnummer } from '../../bootstrap/fnr-util';
import RedigerArbeidsliste from './arbeidsliste-rediger';
import FjernArbeidsliste from './arbeidsliste-fjern';
import LeggTilArbeidsliste from './arbeidsliste-legg-til';
import { selectArbeidslisteReducer } from './arbeidsliste-selector';
import { slettArbeidsliste } from './arbeidsliste-reducer';
import { LUKK_MODAL } from '../../ducks/modal';

function ArbeidslisteContainer({
    navnPaMotpart,
    path,
    arbeidslisteReducer,
    onSlettArbeidsliste,
    history,
    lukkModal,
    motpart,
}) {
    const onLukkModal = () => {
        history.push('/');
        lukkModal();
    };

    return (
        <StandardModal name="arbeidslisteModal">
            <ModalHeader />
            <Innholdslaster
                avhengigheter={[arbeidslisteReducer, motpart]}
                className="arbeidsliste__spinner"
            >
                <Switch>
                    <Route exact path={`${path}/leggtil`}>
                        <LeggTilArbeidsliste navn={navnPaMotpart} />
                    </Route>
                    <Route exact path={`${path}/rediger`}>
                        <RedigerArbeidsliste navn={navnPaMotpart} />
                    </Route>
                    <Route exact path={`${path}/fjern`}>
                        <FjernArbeidsliste
                            navn={navnPaMotpart}
                            onBekreftSlett={onSlettArbeidsliste}
                            lukkModal={onLukkModal}
                        />
                    </Route>
                </Switch>
            </Innholdslaster>
        </StandardModal>
    );
}

ArbeidslisteContainer.defaultProps = {
    navnPaMotpart: '',
};

ArbeidslisteContainer.propTypes = {
    navnPaMotpart: PT.string,
    motpart: AppPT.reducer.isRequired,
    arbeidslisteReducer: AppPT.reducer.isRequired,
    path: PT.string.isRequired,
    history: PT.object.isRequired,
    onSlettArbeidsliste: PT.func.isRequired,
    lukkModal: PT.func.isRequired,
};

const mapStateToProps = (state, ownProps) => ({
    motpart: selectMotpartReducer(state),
    path: ownProps.match.path,
    navnPaMotpart: selectNavnPaMotpart(state),
    arbeidslisteReducer: selectArbeidslisteReducer(state),
});

const mapDispatchToProps = dispatch =>
    bindActionCreators(
        {
            onSlettArbeidsliste: () => slettArbeidsliste(getFodselsnummer()),
            lukkModal: () => dispatch({ type: LUKK_MODAL }),
        },
        dispatch
    );

export default withRouter(
    connect(mapStateToProps, mapDispatchToProps)(ArbeidslisteContainer)
);