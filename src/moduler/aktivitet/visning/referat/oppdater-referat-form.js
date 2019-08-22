import React, { useContext, useEffect } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import { Knapp } from 'nav-frontend-knapper';
import useFormstate from '@nutgaard/use-formstate';
import { Undertittel } from 'nav-frontend-typografi';
import { oppdaterReferat, publiserReferat } from '../../aktivitet-actions';
import { STATUS } from '../../../../ducks/utils';
import { HiddenIfHovedknapp } from '../../../../felles-komponenter/hidden-if/hidden-if-knapper';
import { selectAktivitetStatus } from '../../aktivitet-selector';
import Textarea from '../../../../felles-komponenter/skjema/input-v2/textarea';
import FormErrorSummary from '../../../../felles-komponenter/skjema/form-error-summary/form-error-summary';
import * as AppPT from '../../../../proptypes';
import { DirtyContext } from '../../../context/dirty-context';

function validate(val) {
    if (val.trim().length === 0) {
        return 'Du må fylle ut samtalereferat';
    }
    if (val.length > 5000) {
        return 'Du må korte ned teksten til 5000 tegn';
    }
    return null;
}

const validator = useFormstate({
    referat: validate,
});

const label = <Undertittel>Samtalereferat</Undertittel>;

function OppdaterReferatForm(props) {
    const {
        onSubmit,
        aktivitet,
        oppdaterer,
        erReferatPublisert,
        dispatchPubliserReferat,
    } = props;

    const state = validator({
        referat: aktivitet.referat || '',
    });

    const dirty = useContext(DirtyContext);

    useEffect(() => dirty.setFormIsDirty('referat', !state.pristine), [
        dirty.setFormIsDirty,
        state.pristine,
    ]); //eslint-disable-line

    const oppdaterOgPubliser = state.onSubmit(values => {
        return onSubmit(values).then(response => {
            if (response.data) {
                dispatchPubliserReferat(response.data);
            }
        });
    });

    return (
        <form
            onSubmit={state.onSubmit(onSubmit)}
            className="oppdater-referat aktivitetvisning__underseksjon"
        >
            <FormErrorSummary
                errors={state.errors}
                submittoken={state.submittoken}
            />
            <Textarea
                label={label}
                disabled={oppdaterer}
                maxLength={5000}
                visTellerFra={500}
                placeholder="Skriv samtalereferatet her"
                {...state.fields.referat}
            />

            <HiddenIfHovedknapp
                spinner={oppdaterer}
                disabled={oppdaterer}
                hidden={erReferatPublisert}
                onClick={oppdaterOgPubliser}
            >
                Del
            </HiddenIfHovedknapp>

            <Knapp spinner={oppdaterer} disabled={oppdaterer}>
                Lagre
            </Knapp>
        </form>
    );
}

OppdaterReferatForm.propTypes = {
    onSubmit: PT.func.isRequired,
    aktivitet: AppPT.aktivitet.isRequired,
    erReferatPublisert: PT.bool.isRequired,
    oppdaterer: PT.bool.isRequired,
    dispatchPubliserReferat: PT.func.isRequired,
    onFerdig: PT.func.isRequired,
};

const mapStateToProps = (state, props) => {
    const { erReferatPublisert } = props.aktivitet;
    return {
        oppdaterer:
            selectAktivitetStatus(state) ===
            (STATUS.PENDING || STATUS.RELOADING),
        erReferatPublisert,
    };
};

const mapDispatchToProps = (dispatch, props) => ({
    dispatchPubliserReferat: aktivitet => dispatch(publiserReferat(aktivitet)),
    onSubmit: referatData => {
        const aktivitetMedOppdatertReferat = {
            ...props.aktivitet,
            ...referatData,
        };
        return dispatch(
            oppdaterReferat(aktivitetMedOppdatertReferat)
        ).then(res => {
            props.onFerdig();
            return res;
        });
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    OppdaterReferatForm
);
