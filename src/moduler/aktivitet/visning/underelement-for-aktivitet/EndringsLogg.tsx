import { Accordion } from '@navikt/ds-react';
import React from 'react';

import { VeilarbAktivitet } from '../../../../datatypes/internAktivitetTypes';
import VersjonerForAktivitet from '../versjoner/versjoner-for-aktivitet';

interface Props {
    aktivitet: VeilarbAktivitet;
}

const EndringsLogg = (props: Props) => {
    const { aktivitet } = props;

    return (
        <Accordion.Item className="first:border-t-2 first:border-border-divider">
            <Accordion.Header>Historikk</Accordion.Header>
            <Accordion.Content>
                <VersjonerForAktivitet visible={true} aktivitet={aktivitet} />
            </Accordion.Content>
        </Accordion.Item>
    );
};

export default EndringsLogg;
