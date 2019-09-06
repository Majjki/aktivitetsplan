import React, { useState } from 'react';
import PT from 'prop-types';
import { connect } from 'react-redux';
import * as statuser from '../../../../constant';
import * as AppPT from '../../../../proptypes';
import StillingEtikettForm from './stilling-etikett-form';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import Etikett from '../../etikett/etikett';
import { oppdaterAktivitetEtikett } from '../../aktivitet-actions';
import EndreLinje from '../endre-linje/endre-linje';
import Underseksjon from '../underseksjon/underseksjon';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { selectKanEndreAktivitetStatus } from '../../aktivitetliste-selector';

function OppdaterAktivitetEtikett(props) {
    const { aktivitet, disableEtikettEndringer, lagreEtikett } = props;
    const [endring, setEndring] = useState(false);

    const visning = <Etikett etikett={aktivitet.etikett} />;

    const onSubmit = val =>
        lagreEtikett(val).then(() => {
            setEndring(false);
            document.querySelector('.aktivitet-modal').focus();
        });

    const form = (
        <StillingEtikettForm
            disabled={disableEtikettEndringer}
            aktivitet={aktivitet}
            onSubmit={onSubmit}
        />
    );

    return (
        <Underseksjon>
            <EndreLinje
                tittel="Hvor i søknadsprossen?"
                form={form}
                endring={endring}
                setEndring={setEndring}
                visning={visning}
            />
        </Underseksjon>
    );
}

OppdaterAktivitetEtikett.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    disableEtikettEndringer: PT.bool.isRequired,
    lagreEtikett: PT.func.isRequired,
};

const mapStateToProps = (state, props) => ({
    disableEtikettEndringer:
        selectLasterAktivitetData(state) ||
        !selectKanEndreAktivitetStatus(state, props.aktivitet) ||
        !selectErUnderOppfolging(state),
});

const mapDispatchToProps = (dispatch, props) => ({
    lagreEtikett: ({ etikettstatus }) => {
        if (etikettstatus === props.aktivitet.etikett) {
            return Promise.resolve();
        }

        const nyEtikett =
            etikettstatus === statuser.INGEN_VALGT ? null : etikettstatus;
        return dispatch(
            oppdaterAktivitetEtikett({
                ...props.aktivitet,
                etikett: nyEtikett,
            })
        );
    },
});

export default connect(mapStateToProps, mapDispatchToProps)(
    OppdaterAktivitetEtikett
);
