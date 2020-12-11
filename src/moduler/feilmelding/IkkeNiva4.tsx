import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import Hjelpetekst from 'nav-frontend-hjelpetekst';
import { PopoverOrientering } from 'nav-frontend-popover';
import React from 'react';
import { useSelector } from 'react-redux';

import { selectErBrukerManuell, selectReservasjonKRR } from '../oppfolging-status/oppfolging-selector';
import { selectNivaa4, selectNivaa4LastetOk } from '../tilgang/tilgang-selector';
import styles from './Feilmelding.module.less';

const Mere = () => (
    <Hjelpetekst type={PopoverOrientering.Under}>
        Dette er et midlertidig problem på grunn av ny teknisk løsning etter koronasituasjonen.
        <ul>
            <li>
                Hvis brukeren svarer på digital dialog, så kan du kommunisere digitalt. Forhåndsorientering og varsel
                vil ikke fungere på denne brukeren.
                <br />
            </li>
            <li>Hvis brukeren ikke svarer på digital dialog, så setter du brukeren til manuell bruker.</li>
        </ul>
    </Hjelpetekst>
);

const Nivaa4Feilmelding = () => {
    const niva4 = useSelector(selectNivaa4);
    const lastetOk = useSelector(selectNivaa4LastetOk);
    const erreservertKRR = useSelector(selectReservasjonKRR);
    const erManuell = useSelector(selectErBrukerManuell);

    if (niva4 || !lastetOk || erManuell || erreservertKRR) {
        return null;
    }

    return (
        <div className={styles.feilmelding}>
            <AlertStripeAdvarsel>
                Systemet får ikke sjekket om denne brukeren er en digital eller manuell bruker. <Mere />
            </AlertStripeAdvarsel>
        </div>
    );
};

export default Nivaa4Feilmelding;