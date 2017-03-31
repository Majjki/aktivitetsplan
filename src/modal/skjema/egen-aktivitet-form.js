import React, { PropTypes as PT } from 'react';
import { formValueSelector } from 'redux-form';
import { connect } from 'react-redux';
import { FormattedMessage } from 'react-intl';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import moment from 'moment';
import { LabelledField, validForm, rules } from 'react-redux-form-validation';
import { Hovedknapp } from 'nav-frontend-knapper';
import Textarea from './textarea/textarea';
import DatoFelt from './datovelger/dato-felt';
import './skjema.less';


const TITTEL_MAKS_LENGDE = 255;
const HENSIKT_MAKS_LENGDE = 255;
const LENKE_MAKS_LENGDE = 2000;
const BESKRIVELSE_MAKS_LENGDE = 5000;

const pakrevdTittel = rules.minLength(0, 'Du må fylle ut overskriften');
const begrensetTittelLengde =
    rules.maxLength(TITTEL_MAKS_LENGDE, `Overskriften kan ikke være lenger en ${TITTEL_MAKS_LENGDE} tegn`);
const pakrevdFraDato = rules.minLength(0, 'Du må fylle ut fra datoen');
const pakrevdTilDato = rules.minLength(0, 'Du må fylle ut fristen');
const begrensetHensiktLengde =
    rules.maxLength(HENSIKT_MAKS_LENGDE, `Hensiktteksten kan ikke være lenger en ${HENSIKT_MAKS_LENGDE} tegn`);
const begrensetLenkeLengde =
    rules.maxLength(LENKE_MAKS_LENGDE, `Lenken kan ikke være lenger en ${LENKE_MAKS_LENGDE} tegn`);
const begrensetBeskrivelseLengde =
    rules.maxLength(BESKRIVELSE_MAKS_LENGDE, `Beskrivelsen kan ikke være lenger en ${BESKRIVELSE_MAKS_LENGDE} tegn`);


function EgenAktivitetForm(props) {
    return (
        <form onSubmit={props.handleSubmit} noValidate="noValidate">
            <div className="skjema-innlogget aktivitetskjema">
                {props.errorSummary}
                <div className="aktivitetskjema__header">
                    <Innholdstittel>
                        <FormattedMessage id="egen-aktivitet-form.header" />
                    </Innholdstittel>
                    <Undertekst>
                        <FormattedMessage id="aktivitet-form.pakrevd-felt-info" />
                    </Undertekst>
                </div>

                <LabelledField
                    name="tittel"
                    type="text"
                    className="skjemaelement"
                    inputClass="skjemaelement__input input--fullbredde"
                    labelClass="skjemaelement__label"
                ><FormattedMessage id="egen-aktivitet-form.label.overskrift" /></LabelledField>
                <div className="dato-container">
                    <DatoFelt feltNavn="fraDato" labelId="egen-aktivitet-form.label.fra-dato" senesteTom={props.currentTilDato} />
                    <DatoFelt feltNavn="tilDato" labelId="egen-aktivitet-form.label.til-dato" tidligsteFom={props.currentFraDato} />
                </div>
                <LabelledField
                    name="lenke"
                    type="text"
                    className="skjemaelement"
                    inputClass="skjemaelement__input input--fullbredde"
                    labelClass="skjemaelement__label"
                ><FormattedMessage id="egen-aktivitet-form.label.lenke" /></LabelledField>
                <LabelledField
                    name="hensikt"
                    type="text"
                    className="skjemaelement"
                    inputClass="skjemaelement__input input--fullbredde"
                    labelClass="skjemaelement__label"
                ><FormattedMessage id="egen-aktivitet-form.label.hensikt" /></LabelledField>
                <Textarea
                    feltNavn="beskrivelse"
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

EgenAktivitetForm.propTypes = {
    handleSubmit: PT.func,
    errorSummary: PT.node.isRequired,
    currentFraDato: PT.instanceOf(Date),
    currentTilDato: PT.instanceOf(Date)
};

const formNavn = 'egen-aktivitet';
const EgenAktivitetReduxForm = validForm({
    form: formNavn,
    onSubmit: () => {
    },
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
            status: 'PLANLAGT',
            ...aktivitet
        },
        currentFraDato: moment(selector(state, 'fraDato')).toDate(),
        currentTilDato: moment(selector(state, 'tilDato')).toDate()
    };
};
const mapDispatchToProps = () => ({});

export default connect(mapStateToProps, mapDispatchToProps)(EgenAktivitetReduxForm);
