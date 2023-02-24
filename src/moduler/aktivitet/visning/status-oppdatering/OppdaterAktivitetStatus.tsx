import { BodyShort } from '@navikt/ds-react';
import React, { useContext, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Dispatch } from 'redux';

import { STATUS_AVBRUTT, STATUS_FULLFOERT } from '../../../../constant';
import { AktivitetStatus } from '../../../../datatypes/aktivitetTypes';
import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import { flyttetAktivitetMetrikk } from '../../../../felles-komponenter/utils/logging';
import { aktivitetStatusMap } from '../../../../utils/textMappers';
import { DirtyContext } from '../../../context/dirty-context';
import { selectErUnderOppfolging } from '../../../oppfolging-status/oppfolging-selector';
import { flyttAktivitetMedBegrunnelse } from '../../aktivitet-actions';
import { selectLasterAktivitetData } from '../../aktivitet-selector';
import { selectKanEndreAktivitetStatus } from '../../aktivitetlisteSelector';
import EndreLinje from '../endre-linje/EndreLinje';
import AktivitetStatusForm from './AktivitetStatusForm';

const useDisableStatusEndring = (aktivitet: VeilarbAktivitet) => {
    const lasterAktivitet = useSelector(selectLasterAktivitetData);
    const underOppfolging = useSelector(selectErUnderOppfolging);
    const kanEndreAktivitet = useSelector((state) => selectKanEndreAktivitetStatus(state, aktivitet));

    return lasterAktivitet || !underOppfolging || !kanEndreAktivitet;
};

const lagreStatusEndringer = (
    dispatch: Dispatch,
    values: { aktivitetstatus: AktivitetStatus; begrunnelse?: string },
    aktivitet: VeilarbAktivitet
) => {
    if (values.aktivitetstatus === aktivitet.status) {
        return Promise.resolve();
    }

    flyttetAktivitetMetrikk('submit', aktivitet, values.aktivitetstatus);
    return dispatch<any>(flyttAktivitetMedBegrunnelse(aktivitet, values.aktivitetstatus, values.begrunnelse));
};

interface OppdaterAktivitetStatusProps {
    aktivitet: VeilarbAktivitet;
}

function OppdaterAktivitetStatus(props: OppdaterAktivitetStatusProps) {
    const { aktivitet } = props;
    const [open, setIsOpen] = useState(false);
    const dispatch = useDispatch();
    const disableStatusEndring = useDisableStatusEndring(aktivitet);

    const onSubmit = (val: any): Promise<any> =>
        lagreStatusEndringer(dispatch, val, aktivitet).then(() => {
            setIsOpen(false);
            // @ts-ignore
            document.querySelector('.aktivitet-modal').focus();
        });

    const subtittel = <BodyShort>{aktivitetStatusMap[aktivitet.status]}</BodyShort>;
    const { setFormIsDirty } = useContext(DirtyContext);
    const form = <AktivitetStatusForm disabled={disableStatusEndring} onSubmit={onSubmit} aktivitet={aktivitet} />;

    const kanEndre = aktivitet.status !== STATUS_FULLFOERT && aktivitet.status !== STATUS_AVBRUTT;

    return (
        <EndreLinje
            onClick={() => {
                if (open) {
                    setFormIsDirty('status', false);
                }
                setIsOpen(!open);
            }}
            open={open}
            tittel="Hva er status på aktiviteten?"
            subtittel={subtittel}
            form={form}
            kanEndre={kanEndre}
        />
    );
}

export default OppdaterAktivitetStatus;
