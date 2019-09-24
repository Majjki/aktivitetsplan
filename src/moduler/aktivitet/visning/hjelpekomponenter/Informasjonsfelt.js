import React from 'react';
import PT from 'prop-types';
import Tekstomrade from 'nav-frontend-tekstomrade';
import { Normaltekst } from 'nav-frontend-typografi';
import DetaljFelt from './detalj-felt';
import HiddenIfHOC from '../../../../felles-komponenter/hidden-if/hidden-if';

export default function Informasjonsfelt({ tittel, innhold, fullbredde, formattertTekst, beskrivelse }) {
    const Container = formattertTekst ? Tekstomrade : Normaltekst;
    return (
        <DetaljFelt tittel={tittel} visible={innhold !== null} fullbredde={fullbredde} beskrivelse={beskrivelse}>
            <Container className="detaljfelt__tekst">{innhold}</Container>
        </DetaljFelt>
    );
}

export const HiddenIfInformasjonsfelt = HiddenIfHOC(Informasjonsfelt);

Informasjonsfelt.propTypes = {
    tittel: PT.node.isRequired,
    innhold: PT.node,
    fullbredde: PT.bool,
    formattertTekst: PT.bool,
    beskrivelse: PT.bool
};

Informasjonsfelt.defaultProps = {
    innhold: undefined,
    fullbredde: false,
    formattertTekst: false,
    beskrivelse: false
};
