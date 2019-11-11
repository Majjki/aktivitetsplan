import React, { useEffect } from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import Innholdslaster from '../../felles-komponenter/utils/innholdslaster';
import { MalModal } from './mal-modal';
import { hentMal, selectMalStatus } from './aktivitetsmal-reducer';
import { selectMalListeStatus } from './aktivitetsmal-selector';
import { selectViserHistoriskPeriode } from '../filtrering/filter/filter-selector';
import { hentMalListe } from './malliste-reducer';
import { Innholdstittel, Undertekst } from 'nav-frontend-typografi';
import './mal.less';
import MalHistorikk from './mal-historikk';
import MalContainer from './mal-container';

function Mal() {
    const malStatus = useSelector(selectMalStatus, shallowEqual);
    const malListeStatus = useSelector(selectMalListeStatus, shallowEqual);
    const viserHistoriskPeriode = useSelector(selectViserHistoriskPeriode, shallowEqual);

    const dispatch = useDispatch();

    useEffect(() => {
        dispatch(hentMal());
        dispatch(hentMalListe());
    }, [dispatch]);

    const avhengigheter = [malStatus, malListeStatus];

    return (
        <MalModal>
            <Innholdstittel className="aktivitetmal__header">
                {viserHistoriskPeriode ? 'Ditt mål fra en tidligere periode' : 'Ditt mål'}
            </Innholdstittel>
            <Undertekst className="aktivitetmal__sub-header">
                Beskriv målet ditt, gjerne både kortsiktige og langsiktige mål og hva slags arbeidsoppgaver du ønsker
                deg.
            </Undertekst>
            <Innholdslaster avhengigheter={avhengigheter} alleOK>
                <section className="aktivitetmal">
                    <MalContainer />
                    <MalHistorikk />
                </section>
            </Innholdslaster>
        </MalModal>
    );
}

export default Mal;