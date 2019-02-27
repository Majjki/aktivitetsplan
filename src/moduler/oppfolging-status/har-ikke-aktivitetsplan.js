import React from 'react';
import { FormattedMessage } from 'react-intl';
import { AlertStripeAdvarsel } from 'nav-frontend-alertstriper';
import { Normaltekst } from 'nav-frontend-typografi';
import { HoyreChevron } from 'nav-frontend-chevron';
import PT from 'prop-types';
import Lenke from '../../felles-komponenter/utils/lenke';

const href =
    'https://tjenester.nav.no/veiledearbeidssoker/mistet-jobben/registrering-arbeidssoker?sprak=nb';

function HarIkkeAktivitetsplan({ erVeileder }) {
    const advarsel = erVeileder
        ? 'har.ikke.aktivitetsplan.advarsel.veileder'
        : 'har.ikke.aktivitetsplan.advarsel.bruker';

    return (
        <div className="har-ikke-aktivitetsplan-container">
            <AlertStripeAdvarsel>
                <Normaltekst>
                    <FormattedMessage id={advarsel} />
                </Normaltekst>
                {!erVeileder &&
                    <Lenke href={href}>
                        <FormattedMessage id="ikke.under.oppfolging.reaktivering.lenke" />
                        <HoyreChevron />
                    </Lenke>}
            </AlertStripeAdvarsel>
        </div>
    );
}

HarIkkeAktivitetsplan.propTypes = {
    erVeileder: PT.bool.isRequired,
};

export default HarIkkeAktivitetsplan;