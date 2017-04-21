import React, { PropTypes as PT, Component } from 'react';
import { connect } from 'react-redux';
import Tavle from './tavle/tavle';
import Kolonne from './aktivitetstavlekolonne';
import { hentAktiviteter } from '../../ducks/aktiviteter';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';

import {
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT
} from '../../constant';

class AktivitetsTavle extends Component {

    componentDidMount() {
        this.props.doHentAktiviteter();
    }

    render() {
        return (
            <Innholdslaster avhengigheter={[this.props.aktivitet]}>
                <Tavle defaultStartKolonne={1} antallKolonner={3} className="aktivitetstavle">
                    <Kolonne status={STATUS_BRUKER_ER_INTRESSERT} tittelId="aktivitetstavle.brukerErInteressert" />
                    <Kolonne status={STATUS_PLANLAGT} tittelId="aktivitetstavle.planlagt" />
                    <Kolonne status={STATUS_GJENNOMFOERT} tittelId="aktivitetstavle.gjennomfoert" />
                    <Kolonne status={STATUS_FULLFOERT} tittelId="aktivitetstavle.fullfoert" />
                    <Kolonne status={STATUS_AVBRUTT} tittelId="aktivitetstavle.avbrutt" />
                </Tavle>
            </Innholdslaster>
        );
    }
}

AktivitetsTavle.propTypes = {
    doHentAktiviteter: PT.func.isRequired,
    aktivitet: PT.shape({
        status: PT.string.isRequired
    })
};

const mapStateToProps = (state) => ({
    aktivitet: state.data.aktiviteter
});

const mapDispatchToProps = (dispatch) => ({
    doHentAktiviteter: () => hentAktiviteter()(dispatch)
});

export default connect(mapStateToProps, mapDispatchToProps)(AktivitetsTavle);
