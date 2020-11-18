import shajs from 'sha.js';

import { Aktivitet, AktivitetStatus, Lest, OppfolgingsPeriode } from '../../types';

interface Frontendlogger {
    event: (name: string, fields: object, tags: object) => void;
}

export default function loggEvent(eventNavn: string, feltObjekt?: object, tagObjekt?: object) {
    const frontendlogger: Frontendlogger = (window as any).frontendlogger;
    if (frontendlogger && frontendlogger.event) {
        frontendlogger.event(eventNavn, feltObjekt || {}, tagObjekt || {});
    } else {
        // eslint-disable-next-line
        console.log(eventNavn, { feltObjekt, tagObjekt });
    }
}

const FORHANDSORIENTERING_LOGGEVENT = 'aktivitetsplan.forhandsorientering';
const FORHANDSORIENTERING_LOGGEVENT_KRR_KVP_MANUELL = 'avtaltMedNavKrrKvpManuell';
const FORHANDSORIENTERING_LOGGEVENT_MINDRE_ENN_SYV_DAGER = 'avtaltMedNavMindreEnnSyvDager';
const FORHANDSORIENTERING_LOGGEVENT_TILLTAK_SPESIALTILPASSAD = 'tilltakSpesialTilltakBruker';

const MITTMAL_KLIKK_LOGGEVENT = 'aktivitetsplan.mittmal.klikk';
const MITTMAL_LAGRE_LOGGEVENT = 'aktivitetsplan.mittmal.lagre';
const TID_BRUKT_GAINNPA_PLANEN = 'tidbrukt.gainnpa.planen';

export const LOGGING_ANTALLBRUKERE = 'aktivitetsplan.antallSluttBrukere';
export const ANTALL_VEILEDERE = 'aktivitetsplan.antallVeiledere';
export const LOGG_BRUKER_IKKE_OPPFOLGING = 'aktivitetsplan.antallBrukerIkkeOppfolging';
export const PRINT_MODSAL_OPEN = 'aktivitetsplan.printmodal';
export const TRYK_PRINT = 'aktivitetsplan.printmodalprint';

export const APNE_NY_AKTIVITET = 'aktivitetsplan.nyAktivitet.trykk';
export const APNE_OM_TJENESTEN = 'aktivitetsplan.omTjenesten.trykk';
export const APNE_ENDRE_AKTIVITET = 'aktivitetsplan.endreAktivitet.trykk';
export const OPNE_AKTIVITETFILTER = 'aktivitetsplan.aktivitetfilter.opne';
export const VIS_HISTORISK_PERIODE = 'aktivitetsplan.vis.historisk';
export const LIST_HISTORISK_PERIODE = 'aktivitetsplan.list.historisk';

const filterBase = 'aktivitetsplan.filter.';
export const AKTIVITESTYPE_FILER_METRIKK = `${filterBase}aktivitestype`;
export const STATUS_FILER_METRIKK = `${filterBase}status`;
export const AVTALT_FILER_METRIKK = `${filterBase}avtalt`;
export const TILSTAND_FILTER_METRIKK = `${filterBase}Tilstand`;

const AKTIVITET_FLYTTET = 'aktivitetsplan.aktivitet.flyttet';

export function hash(string?: string): string | undefined {
    return string ? shajs('sha256').update(string).digest('hex') : undefined;
}

export function loggAntalVeiledere(servicegruppe: string, underOppfolging: boolean, ident: string, aktorId?: string) {
    const fields = {
        underOppfolging,
        veileder: hash(ident),
        bruker: hash(aktorId),
    };
    loggEvent(ANTALL_VEILEDERE, fields, { servicegruppe });
}

export function loggingAntallBrukere(servicegruppe: string, underOppfolging: boolean, aktorId: string) {
    if (!underOppfolging) {
        loggEvent(LOGG_BRUKER_IKKE_OPPFOLGING, {}, { servicegruppe });
    } else {
        loggEvent(LOGGING_ANTALLBRUKERE, { bruker: hash(aktorId) }, { servicegruppe });
    }
}

export function loggForhandsorienteringTiltak() {
    loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
        forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_TILLTAK_SPESIALTILPASSAD,
    });
}

export function metrikkTidForsteAvtalte(tid: number) {
    loggEvent('aktivitetsplan.aktivitet.forste.avtalt.v2', {
        tidSidenOppfolging: tid,
    });
}

export function flyttetAktivitetMetrikk(flytteMetode: string, aktivitet: Aktivitet, nyStatus: AktivitetStatus) {
    loggEvent(AKTIVITET_FLYTTET, {
        fraStatus: aktivitet.status,
        tilStatus: nyStatus,
        aktivitetType: aktivitet.type,
        flytteMetode,
    });
}

export function loggForhandsorientering(
    erManuellKrrKvpBruker: boolean,
    mindreEnSyvDagerIgen: boolean,
    avtaltForm: string
) {
    if (erManuellKrrKvpBruker) {
        return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
            forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_KRR_KVP_MANUELL,
        });
    }

    if (mindreEnSyvDagerIgen) {
        return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
            forhandsorienteringType: FORHANDSORIENTERING_LOGGEVENT_MINDRE_ENN_SYV_DAGER,
        });
    }

    return loggEvent(FORHANDSORIENTERING_LOGGEVENT, {
        forhandsorienteringType: avtaltForm,
    });
}

export function loggMittMalKlikk(veileder: boolean) {
    loggEvent(MITTMAL_KLIKK_LOGGEVENT, { erVeileder: veileder });
}

export function loggMittMalLagre(veileder: boolean) {
    loggEvent(MITTMAL_LAGRE_LOGGEVENT, { erVeileder: veileder });
}

function tidBruktFra(fraDato: number | string, tilDato?: number | string) {
    const tilD = tilDato ? new Date(tilDato).getTime() : new Date().getTime();
    return Math.ceil(Math.abs(new Date(fraDato).getTime() - tilD) / (1000 * 3600 * 24));
}

function loggTidBruktFraRegistrert(fraDato: number | string) {
    loggEvent(TID_BRUKT_GAINNPA_PLANEN, {
        tidBruktFraRegistrert: tidBruktFra(fraDato),
    });
}

export function loggTidBruktGaaInnPaaAktivitetsplanen(lest: Array<Lest>, perioder: Array<OppfolgingsPeriode>) {
    const periode = perioder.find((p) => p.sluttDato === null);
    if (periode) {
        // Tid brukt fra registrert til aktivitetsplanen
        if (lest.length === 0) {
            const startDatoPaaOppfolging = periode.startDato;
            const tidVeilarbLestBleLansert = new Date('2019-02-01').getTime();
            const tidStartOppfolging = new Date(startDatoPaaOppfolging).getTime();
            if (tidVeilarbLestBleLansert < tidStartOppfolging) {
                loggTidBruktFraRegistrert(startDatoPaaOppfolging);
            }
        }
        // Tid brukt mellom gangene i aktivitetsplanen
        if (lest.length !== 0) {
            const lestAktivitetsplan = lest.find((a) => a.ressurs === 'aktivitetsplan');
            if (lestAktivitetsplan) {
                const startDato = new Date(periode.startDato).getTime();
                const tidspunkt = new Date(lestAktivitetsplan.tidspunkt).getTime();
                if (startDato < tidspunkt) {
                    loggEvent(TID_BRUKT_GAINNPA_PLANEN, {
                        tidMellomGangene: tidBruktFra(tidspunkt),
                    });
                } else {
                    loggTidBruktFraRegistrert(startDato);
                }
            }
        }
    }
}
