import React from 'react';
import {useSelector} from 'react-redux';

import {AlleAktiviteter, isVeilarbAktivitet} from '../../../datatypes/aktivitetTypes';
import {VeilarbAktivitet, VeilarbAktivitetType} from '../../../datatypes/internAktivitetTypes';
import {ETIKETT_FILTER_METRIKK} from '../../../felles-komponenter/utils/logging';
import {stillingOgStillingFraNavEtikettMapper} from '../../../utils/textMappers';
import {selectAktiviterForAktuellePerioden} from '../../aktivitet/aktivitetlisteSelector';
import FilterVisningsKomponent, {EtikettFilterType, FilterValueExtractor} from './FilterVisning';

function notNull<T>(thing: T | null | undefined): thing is T {
    return !!thing;
}
const getFilterableFields: FilterValueExtractor<VeilarbAktivitet, keyof EtikettFilterType> = (aktvitet) => {
    if (aktvitet.type === VeilarbAktivitetType.STILLING_FRA_NAV_TYPE) {
        return [aktvitet.stillingFraNavData.soknadsstatus].filter(notNull)
    } else {
        return [aktvitet.etikett].filter(notNull)
    }
};

const EtikettFilter = () => {
    const aktiviteter: AlleAktiviteter[] = useSelector(selectAktiviterForAktuellePerioden);
    const filters = Array.from(new Set(aktiviteter.filter(isVeilarbAktivitet).flatMap(getFilterableFields)));

    return (
        <FilterVisningsKomponent
            filters={filters}
            filterKategori={'etikett'}
            tekst="Stillingsstatus"
            metrikkNavn={ETIKETT_FILTER_METRIKK}
            textMapper={stillingOgStillingFraNavEtikettMapper}
        />
    );
};

export default EtikettFilter;
