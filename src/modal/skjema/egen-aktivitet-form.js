import React, { PropTypes as PT, Component } from 'react';
import { formValueSelector, isDirty } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { validForm, rules } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import Textarea from './textarea/textarea';
import Input from './input/input';
import Datovelger from './datovelger/datovelger';
import './skjema.less';
import { STATUS_BRUKER_ER_INTRESSERT } from '../../constant';

const TITTEL_MAKS_LENGDE = 255;
const HENSIKT_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;

const pakrevdTittel = rules.minLength(0, <FormattedMessage id="egen-aktivitet-form.feilmelding.paakrevd-tittel" />);
const begrensetTittelLengde = rules.maxLength(TITTEL_MAKS_LENGDE,
    <FormattedMessage id="egen-aktivitet-form.feilmelding.tittel-lengde" values={{ TITTEL_MAKS_LENGDE }} />
);
const pakrevdFraDato = rules.minLength(0, <FormattedMessage id="egen-aktivitet-form.feilmelding.paakrevd-fradato" />);
const pakrevdTilDato = rules.minLength(0, <FormattedMessage id="egen-aktivitet-form.feilmelding.paakrevd-tildato" />);
const begrensetHensiktLengde = rules.maxLength(HENSIKT_MAKS_LENGDE,
    <FormattedMessage id="egen-aktivitet-form.feilmelding.hensikt-lengde" values={{ HENSIKT_MAKS_LENGDE }} />
);
const begrensetLenkeLengde = rules.maxLength(LENKE_MAKS_LENGDE,
    <FormattedMessage id="egen-aktivitet-form.feilmelding.lenke-lengde" values={{ LENKE_MAKS_LENGDE }} />
);
const begrensetBeskrivelseLengde = rules.maxLength(BESKRIVELSE_MAKS_LENGDE,
    <FormattedMessage id="egen-aktivitet-form.feilmelding.beskrivelse-lengde" values={{ BESKRIVELSE_MAKS_LENGDE }} />
);


class EgenAktivitetForm extends Component {
    componentDidMount() {
        window.onbeforeunload = this.visLukkDialog.bind(this);
    }

    componentWillUnmount() {
        window.onbeforeunload = null;
    }

    visLukkDialog(e) { // eslint-disable-line
        if (this.props.isDirty) {
            const melding = this.props.intl.formatMessage({ id: 'aktkivitet-skjema.lukk-advarsel' }); // TODO: React-intl
            e.returnValue = melding;
            return melding;
        }
    }

    render() {
        return (
            <form onSubmit={this.props.handleSubmit} noValidate="noValidate">
                <div className="skjema-innlogget aktivitetskjema">
                    {this.props.errorSummary}
                    <div className="aktivitetskjema__header">
                        <Innholdstittel>
                            <FormattedMessage id="egen-aktivitet-form.header" />
                        </Innholdstittel>
                        <Undertekst>
                            <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                        </Undertekst>
                    </div>

                    <Input
                        feltNavn="tittel"
                        disabled={this.props.avtalt === true}
                        labelId="egen-aktivitet-form.label.overskrift"
                        bredde="fullbredde"
                    />
                    <div className="dato-container">
                        <Datovelger
                            feltNavn="fraDato"
                            disabled={this.props.avtalt === true}
                            labelId="egen-aktivitet-form.label.fra-dato"
                            senesteTom={this.props.currentTilDato}
                        />
                        <Datovelger
                            feltNavn="tilDato"
                            labelId="egen-aktivitet-form.label.til-dato"
                            tidligsteFom={this.props.currentFraDato}
                        />
                    </div>
                    <Input
                        feltNavn="lenke"
                        disabled={this.props.avtalt === true}
                        labelId="egen-aktivitet-form.label.lenke"
                        bredde="fullbredde"
                    />
                    <Input
                        feltNavn="hensikt"
                        disabled={this.props.avtalt === true}
                        labelId="egen-aktivitet-form.label.hensikt"
                        bredde="fullbredde"
                    />
                    <Textarea
                        feltNavn="beskrivelse"
                        disabled={this.props.avtalt === true}
                        labelId="egen-aktivitet-form.label.beskrivelse"
                        maxLength={BESKRIVELSE_MAKS_LENGDE}
                    />
                </div>
                <div className="aktivitetskjema__lagre-knapp">
                    <Hovedknapp><FormattedMessage id="egen-aktivitet-form.lagre" /></Hovedknapp>
                </div>
            </form>
        );
    }
}

EgenAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date),
    avtalt: PT.bool,
    isDirty: PT.bool.isRequired,
    intl: intlShape.isRequired
};

export const formNavn = 'egen-aktivitet';
const EgenAktivitetReduxForm = validForm({
    form: formNavn,
    errorSummaryTitle: <FormattedMessage id="egen-aktivitet-form.feiloppsummering-tittel" />,
    validate: {
        tittel: [pakrevdTittel, begrensetTittelLengde],
        fraDato: [pakrevdFraDato],
        tilDato: [pakrevdTilDato],
        lenke: [begrensetLenkeLengde],
        hensikt: [begrensetHensiktLengde],
        beskrivelse: [begrensetBeskrivelseLengde]
    }
})(EgenAktivitetForm);

const selector = formValueSelector(formNavn);
const mapStateToProps = (state, props) => {
    const aktivitet = props.aktivitet || {};
    return {
        initialValues: {
            status: STATUS_BRUKER_ER_INTRESSERT,
            ...aktivitet
        },
        currentFraDato: selector(state, 'fraDato') ? moment(selector(state, 'fraDato')).toDate() : undefined,
        currentTilDato: selector(state, 'tilDato') ? moment(selector(state, 'tilDato')).toDate() : undefined,
        isDirty: isDirty(formNavn)(state),
        avtalt: aktivitet && aktivitet.avtalt
    };
};
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(injectIntl(EgenAktivitetReduxForm));
