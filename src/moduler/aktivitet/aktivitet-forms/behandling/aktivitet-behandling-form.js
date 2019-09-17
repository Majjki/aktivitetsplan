import React from 'react';
import PT from 'prop-types';
import useFormstate from '@nutgaard/use-formstate';
import { BEHANDLING_AKTIVITET_TYPE } from '../../../../constant';
import LagreAktivitet from '../lagre-aktivitet';
import AktivitetFormHeader from '../aktivitet-form-header';
import * as AppPT from '../../../../proptypes';
import PeriodeValidering, {
    validerPeriodeFelt,
} from '../../../../felles-komponenter/skjema/field-group/periode-validering';
import Input from '../../../../felles-komponenter/skjema/input/input';
import Textarea from '../../../../felles-komponenter/skjema/input/textarea';
import {
    validateBehandlingSted,
    validateBehandlingType,
    validateBeskrivelse,
    validateFeltForLangt,
    validateFraDato,
    validateTilDato,
} from './validate';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import DatoField from '../../../../felles-komponenter/skjema/datovelger/datovelger';

function erAvtalt(aktivitet) {
    return aktivitet.avtalt === true;
}

const validator = useFormstate({
    tittel: () => {},
    behandlingType: (val, values, aktivitet) =>
        validateBehandlingType(erAvtalt(aktivitet), val),
    behandlingSted: (val, values, aktivitet) =>
        validateBehandlingSted(erAvtalt(aktivitet), val),
    fraDato: (val, values, aktivitet) =>
        validateFraDato(erAvtalt(aktivitet), aktivitet.tilDato, val),
    tilDato: (val, values, aktivitet) =>
        validateTilDato(aktivitet.fraDato, val),
    effekt: (val, values, aktivitet) =>
        validateFeltForLangt(erAvtalt(aktivitet), val),
    beskrivelse: (val, values, aktivitet) =>
        validateBeskrivelse(erAvtalt(aktivitet), val),
    behandlingOppfolging: (val, values, aktivitet) =>
        validateFeltForLangt(erAvtalt(aktivitet), val),
    periodeValidering: (val, values) =>
        validerPeriodeFelt(values.fraDato, values.tilDato),
});

function BehandlingAktivitetForm(props) {
    const { onSubmit, aktivitet, isDirtyRef } = props;

    const maybeAktivitet = aktivitet || {};
    const avtalt = maybeAktivitet.avtalt === true;

    const initalValues = {
        tittel: maybeAktivitet.tittel || 'Medisinsk behandling',
        behandlingType: maybeAktivitet.behandlingType || '',
        behandlingSted: maybeAktivitet.behandlingSted || '',
        periodeValidering: '',
        fraDato: maybeAktivitet.fraDato || '',
        tilDato: maybeAktivitet.tilDato || '',
        effekt: maybeAktivitet.effekt || '',
        beskrivelse: maybeAktivitet.beskrivelse || '',
        behandlingOppfolging: maybeAktivitet.behandlingOppfolging || '',
    };

    const state = validator(initalValues, aktivitet);

    if (isDirtyRef) {
        isDirtyRef.current = !state.pristine;
    }

    return (
        <form
            onSubmit={state.onSubmit(onSubmit)}
            noValidate="noValidate"
            autoComplete="off"
        >
            <div className="aktivitetskjema">
                <FormErrorSummary
                    errors={state.errors}
                    submittoken={state.submittoken}
                />

                <AktivitetFormHeader
                    tittel="Medisinsk behandling"
                    aktivitetsType={BEHANDLING_AKTIVITET_TYPE}
                />

                <Input
                    disabled={avtalt}
                    label="Type behandling *"
                    {...state.fields.behandlingType}
                />
                <Input
                    disabled={avtalt}
                    label="Behandlingssted *"
                    {...state.fields.behandlingSted}
                />

                <PeriodeValidering
                    valideringFelt={state.fields.periodeValidering}
                >
                    <div className="dato-container">
                        <DatoField
                            disabled={avtalt}
                            label="Fra dato *"
                            senesteTom={maybeAktivitet.tilDato}
                            {...state.fields.fraDato}
                        />
                        <DatoField
                            label="Til dato *"
                            tidligsteFom={maybeAktivitet.fraDato}
                            {...state.fields.tilDato}
                        />
                    </div>
                </PeriodeValidering>

                <Input
                    disabled={avtalt}
                    label="Mål for behandlingen"
                    {...state.fields.effekt}
                />
                <Input
                    disabled={avtalt}
                    label="Oppfølging fra NAV"
                    {...state.fields.behandlingOppfolging}
                />
                <Textarea
                    disabled={avtalt}
                    label="Kort beskrivelse av behandlingen"
                    maxLength={5000}
                    visTellerFra={500}
                    {...state.fields.beskrivelse}
                />
            </div>
            <LagreAktivitet />
        </form>
    );
}

BehandlingAktivitetForm.defaultProps = {
    aktivitet: undefined,
    isDirtyRef: undefined,
};

BehandlingAktivitetForm.propTypes = {
    onSubmit: PT.func.isRequired,
    aktivitet: AppPT.aktivitet,
    isDirtyRef: PT.shape({ current: PT.bool }),
};

export default BehandlingAktivitetForm;
