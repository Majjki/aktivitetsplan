import React from 'react';
import PT from 'prop-types';
import { FormattedMessage, injectIntl, intlShape } from 'react-intl';
import { Undertittel, Element } from 'nav-frontend-typografi';
import Aktivitetsdetaljer from '../aktivitet/visning/hjelpekomponenter/aktivitetsdetaljer';
import * as AppPT from '../../proptypes';
import AktivitetEtikettGruppe from '../../felles-komponenter/aktivitet-etikett/aktivitet-etikett-gruppe';
import { compareAktivitet } from '../aktivitet/aktivitet-util';
import { div as HiddenIfDiv } from '../../felles-komponenter/hidden-if/hidden-if';

function AktivitetReferat({ aktivitet }) {
    const { referat, erReferatPublisert } = aktivitet;
    const harReferat = !!referat;
    const visReferat =
        erReferatPublisert && (harReferat || !aktivitet.historisk);

    return (
        <HiddenIfDiv
            hidden={!visReferat}
            className="printmodal-body__aktivitetreferat"
        >
            {referat}
        </HiddenIfDiv>
    );
}

AktivitetReferat.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
};

function AktivitetPrint({ aktivitet, intl }) {
    const { id, type, tittel } = aktivitet;
    let aktivitetType = intl.formatMessage({
        id: `aktivitetskort.type.${type}`.toLowerCase(),
    });
    aktivitetType =
        aktivitetType.substring(0, 1).toUpperCase() +
        aktivitetType.substring(1, aktivitetType.length).toLowerCase();
    return (
        <div key={id} className="printmodal-body__statusgruppe">
            <p className="printmodal-body__statusgruppe--type">
                {aktivitetType}
            </p>

            <Element
                tag="h2"
                className="printmodal-body__statusgruppe--overskrift"
            >
                {tittel}
            </Element>

            <Aktivitetsdetaljer valgtAktivitet={aktivitet} key={id} />
            <AktivitetReferat aktivitet={aktivitet} />

            <AktivitetEtikettGruppe
                aktivitet={aktivitet}
                className="printmodal-body__aktivitetvisning--etikett"
            />
        </div>
    );
}

AktivitetPrint.propTypes = {
    aktivitet: AppPT.aktivitet.isRequired,
    intl: intlShape.isRequired,
};

function StatusGruppe({ gruppe, intl }) {
    const { status, aktiviteter } = gruppe;
    return (
        <section className="printmodal-body__statusgrupper">
            <Undertittel
                tag="h1"
                className="printmodal-body__statusgruppe--overskrift"
            >
                <FormattedMessage
                    id={`aktivitetstavle.print.${status.toLowerCase()}`}
                />
            </Undertittel>
            {aktiviteter
                .sort(compareAktivitet)
                .map(aktivitet =>
                    <AktivitetPrint
                        aktivitet={aktivitet}
                        key={aktivitet.id}
                        intl={intl}
                    />
                )}
        </section>
    );
}

StatusGruppe.propTypes = {
    gruppe: PT.shape({
        status: PT.string.isRequired,
        aktiviteter: AppPT.aktiviteter.isRequired,
    }),
    intl: intlShape.isRequired,
};

StatusGruppe.defaultProps = {
    gruppe: null,
};

export default injectIntl(StatusGruppe);
