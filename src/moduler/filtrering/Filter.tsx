import { Button } from '@navikt/ds-react';
import React, { useRef, useState } from 'react';
import { useSelector } from 'react-redux';

import { AlleAktiviteter, isArenaAktivitet } from '../../datatypes/aktivitetTypes';
import { useOutsideClick } from '../../felles-komponenter/hooks/useClickOutside';
import Innholdslaster from '../../felles-komponenter/utils/Innholdslaster';
import loggEvent, { OPNE_AKTIVITETFILTER } from '../../felles-komponenter/utils/logging';
import { selectAktiviterForAktuellePerioden, selectAktivitetListeStatus } from '../aktivitet/aktivitetlisteSelector';
import AktivitetStatusFilter from './filter/AktivitetStatusFilter';
import AktivitetTypeFilter from './filter/AktivitetTypeFilter';
import ArenaEtikettFilter from './filter/ArenaEtikettFilter';
import AvtaltMedNavFilter from './filter/AvtaltFilter';
import EtikettFilter from './filter/EtikettFilter';

const sjekkAttFinnesFilteringsAlternativ = (aktivitetsListe: AlleAktiviteter[]) => {
    const muligeFilterKombinasjoner = aktivitetsListe.reduce(
        (res, aktivitet) => {
            const { status, type, etikett, avtalt } = aktivitet;
            res.muligeStatus.add(status);
            res.muligeTyper.add(type);
            if (etikett) {
                if (isArenaAktivitet(aktivitet)) {
                    res.muligeArenaEtiketter.add(etikett);
                } else {
                    res.muligeEtiketter.add(etikett);
                }
            }
            res.muligeAvtalt.add(avtalt);
            return res;
        },
        {
            muligeStatus: new Set(),
            muligeTyper: new Set(),
            muligeEtiketter: new Set(),
            muligeArenaEtiketter: new Set(),
            muligeAvtalt: new Set(),
        }
    );

    return Object.keys(muligeFilterKombinasjoner).reduce(
        (acc, key) => muligeFilterKombinasjoner[key as keyof typeof muligeFilterKombinasjoner].size > 1 || acc,
        false
    );
};

const Filter = () => {
    const ref = useRef<HTMLDivElement | null>(null);
    const [open, setOpen] = useState(false);

    const aktiviteter = useSelector(selectAktiviterForAktuellePerioden);
    const harAktivitet = aktiviteter.length > 1 && sjekkAttFinnesFilteringsAlternativ(aktiviteter);
    const avhengigheter = [useSelector(selectAktivitetListeStatus)];

    useOutsideClick(ref, () => setOpen(false), open);

    return (
        <Innholdslaster avhengigheter={avhengigheter}>
            {harAktivitet ? (
                <div>
                    <Button
                        variant="secondary"
                        name="filter"
                        className="relative w-full"
                        onClick={() => {
                            setOpen(!open);
                            loggEvent(OPNE_AKTIVITETFILTER);
                        }}
                    >
                        Filtrer
                    </Button>
                    {open ? (
                        <div
                            ref={ref}
                            className="rounded-md absolute p-4 bg-white border z-10 w-96 max-h-screen-h-1/2 overflow-auto flex flex-col gap-y-4"
                        >
                            <AvtaltMedNavFilter />
                            <EtikettFilter />
                            <ArenaEtikettFilter />
                            <AktivitetStatusFilter />
                            <AktivitetTypeFilter />
                        </div>
                    ) : null}
                </div>
            ) : null}
        </Innholdslaster>
    );
};

export default Filter;
