import { validerDato } from '../../../../felles-komponenter/skjema/datovelger/utils';

export function validateBeskrivelse(avtalt, value) {
    if (avtalt) {
        return null;
    }
    if (value && value.length > 5000) {
        return `Du må korte ned teksten til 5000 tegn`;
    }
    return null;
}

export function validateOppfolging(avtalt, value) {
    if (avtalt) {
        return null;
    }
    if (value && value.length > 255) {
        return `Du må korte ned teksten til 255 tegn`;
    }
    return null;
}

export function validateAntallStillinger(avtalt, value, brukeStillingerIUken) {
    if (avtalt || brukeStillingerIUken) {
        return null;
    }

    if (value.length === 0) {
        return 'Du må fylle ut antall søknader i perioden';
    }

    if (!Number.isInteger(Number(value))) {
        return 'Antall må være et heltall';
    }
    return null;
}

export function validateAntallStillingerIUken(
    avtalt,
    value,
    brukeStillingerIUken
) {
    if (avtalt || !brukeStillingerIUken) {
        return null;
    }

    if (value.length === 0) {
        return 'Du må fylle ut antall søknader i uken';
    }

    if (!Number.isInteger(Number(value))) {
        return 'Antall må være et heltall';
    }
    return null;
}

export function validateFraDato(avtalt, tilDato, value) {
    if (avtalt) {
        return null;
    }
    if (value.trim().length === 0) {
        return 'Du må fylle ut fra dato';
    }
    return validerDato(value, tilDato, null);
}

export function validateTilDato(avtalt, fraDato, value) {
    if (avtalt) {
        return null;
    }
    if (value.trim().length === 0) {
        return 'Du må fylle ut fra dato';
    }
    return validerDato(value, null, fraDato);
}
