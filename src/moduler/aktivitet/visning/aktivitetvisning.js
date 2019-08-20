import React from 'react';
import PT from 'prop-types';
import UnderelementerForAktivitet from './underelement-for-aktivitet/underelementer-for-aktivitet';
import * as AppPT from '../../../proptypes';
import ModalContainer from '../../../felles-komponenter/modal/modal-container';
import AvtaltContainer from './avtalt-container/avtalt-container';
import {
    TILTAK_AKTIVITET_TYPE,
    GRUPPE_AKTIVITET_TYPE,
    UTDANNING_AKTIVITET_TYPE,
} from '../../../constant';
import BegrunnelseBoks from './hjelpekomponenter/begrunnelse-boks';
import VarslingBoks from './hjelpekomponenter/varsling-boks';
import AktivitetinformasjonVisning from './hjelpekomponenter/aktivitetinformasjon-visning';
import Statusadministrasjon from './hjelpekomponenter/statusadministrasjon';
import ReferatContainer from './referat/referat-container';
import lazyHOC from '../../../felles-komponenter/lazy/lazyHOC';
import { trengerBegrunnelse } from '../aktivitet-util';

function Aktivitetvisning({
    aktivitet,
    tillatEndring,
    laster,
    underOppfolging,
}) {
    const arenaAktivitet = [
        TILTAK_AKTIVITET_TYPE,
        GRUPPE_AKTIVITET_TYPE,
        UTDANNING_AKTIVITET_TYPE,
    ].includes(aktivitet.type);

    const visBegrunnelse =
        !arenaAktivitet &&
        trengerBegrunnelse(aktivitet.avtalt, aktivitet.status, aktivitet.type);

    return (
        <div>
            <ModalContainer className="aktivitetvisning">
                <VarslingBoks
                    className="aktivitetvisning__underseksjon"
                    aktivitet={aktivitet}
                />

                <BegrunnelseBoks
                    className="aktivitetvisning__underseksjon"
                    begrunnelse={aktivitet.avsluttetKommentar}
                    visible={visBegrunnelse}
                />

                <AktivitetinformasjonVisning
                    valgtAktivitet={aktivitet}
                    arenaAktivitet={arenaAktivitet}
                    tillatEndring={tillatEndring}
                    underOppfolging={underOppfolging}
                    laster={laster}
                />

                <AvtaltContainer
                    underOppfolging={underOppfolging}
                    aktivitet={aktivitet}
                    className="aktivitetvisning__underseksjon"
                />

                <ReferatContainer
                    aktivitet={aktivitet}
                    underOppfolging={underOppfolging}
                    delelinje
                />

                <Statusadministrasjon
                    valgtAktivitet={aktivitet}
                    arenaAktivitet={arenaAktivitet}
                />

                <UnderelementerForAktivitet
                    aktivitet={aktivitet}
                    className="aktivitetvisning__underseksjon"
                />
            </ModalContainer>
        </div>
    );
}

Aktivitetvisning.defaultProps = {
    aktivitet: {},
};

Aktivitetvisning.propTypes = {
    aktivitet: AppPT.aktivitet,
    tillatEndring: PT.bool.isRequired,
    laster: PT.bool.isRequired,
    underOppfolging: PT.bool.isRequired,
};

export default lazyHOC(Aktivitetvisning);
