import React from 'react';
import { useSelector } from 'react-redux';

import {
    STATUS_AVBRUTT,
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_FULLFOERT,
    STATUS_GJENNOMFOERT,
    STATUS_PLANLAGT,
} from '../../../constant';
import { AlleAktiviteter } from '../../../datatypes/aktivitetTypes';
import { STATUS_FILER_METRIKK } from '../../../felles-komponenter/utils/logging';
import { aktivitetStatusMap } from '../../../utils/textMappers';
import { selectAktiviterForAktuellePerioden } from '../../aktivitet/aktivitetlisteSelector';
import FilterVisning, { FilterValueExtractor, StatusFilterType } from './FilterVisning';

const filtreringsRekkefolge = [
    STATUS_BRUKER_ER_INTRESSERT,
    STATUS_PLANLAGT,
    STATUS_GJENNOMFOERT,
    STATUS_FULLFOERT,
    STATUS_AVBRUTT,
];

const getType: FilterValueExtractor<AlleAktiviteter, keyof StatusFilterType> = (aktvitet) => {
    return [aktvitet.status];
};
const getOrder = (filterName: string) => filtreringsRekkefolge.indexOf(filterName);

function StatusFilter({ className }: { className: string }) {
    const aktiviteter = useSelector(selectAktiviterForAktuellePerioden);
    const filters = Array.from(new Set(aktiviteter.flatMap(getType))).sort((a, b) => getOrder(a) - getOrder(b));
    return (
        <FilterVisning
            filters={filters}
            filterKategori={'status'}
            tekst="Status"
            metrikkNavn={STATUS_FILER_METRIKK}
            className={className}
            textMapper={aktivitetStatusMap}
        />
    );
}

StatusFilter.defaultProps = {
    className: '',
};

export default StatusFilter;
