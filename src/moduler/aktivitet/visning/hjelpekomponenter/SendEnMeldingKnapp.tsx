import { DialogDots } from '@navikt/ds-icons';
import { Button } from '@navikt/ds-react';
import React from 'react';
import { useSelector } from 'react-redux';
import { useHistory } from 'react-router-dom';

import { AlleAktiviteter } from '../../../../datatypes/aktivitetTypes';
import { Dialog } from '../../../../datatypes/dialogTypes';
import { createSelectDialogForAktivitetId } from '../../../dialog/dialog-selector';
import { byttTilDialogFlate, getDialogLenke } from '../../../dialog/DialogFlateUtils';
import { selectErVeileder } from '../../../identitet/identitet-selector';

interface Props {
    aktivitet: AlleAktiviteter;
}

const SendEnMeldingKnapp = (props: Props) => {
    const { aktivitet } = props;
    const erVeileder = useSelector(selectErVeileder);
    const dialog: Dialog | undefined = useSelector(createSelectDialogForAktivitetId(aktivitet));

    const ulestMeldinger =
        dialog?.henvendelser?.reduce((totaltUleste, melding) => (melding.lest ? totaltUleste : totaltUleste + 1), 0) ||
        0;

    const history = useHistory();

    const veilederOnClick = (event: React.MouseEvent) => {
        if (erVeileder) {
            history.replace('/');
            byttTilDialogFlate(event, aktivitet.id, dialog?.id);
        }
    };

    return (
        <div className="relative">
            <Button
                variant="secondary"
                as="a"
                href={getDialogLenke(erVeileder, aktivitet.id, dialog?.id)}
                icon={<DialogDots aria-hidden />}
                onClick={veilederOnClick}
            >
                {ulestMeldinger > 0 ? `${ulestMeldinger} uleste meldinger` : 'Send en melding'}
            </Button>
            {ulestMeldinger ? (
                <div className="absolute bg-red-500 rounded-full flex justify-center items-center w-7 h-7 text-white -right-3 top-7">
                    <span>{ulestMeldinger}</span>
                </div>
            ) : null}
        </div>
    );
};

export default SendEnMeldingKnapp;
