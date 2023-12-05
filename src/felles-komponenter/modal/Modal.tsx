import { Button, Heading, Modal as AkselModal } from '@navikt/ds-react';
import React, { MouseEventHandler, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { Link as ReactRouterLink } from 'react-router-dom';

import { SerializedError } from '../../api/utils';
import Feilmelding from '../../moduler/feilmelding/Feilmelding';
import { useRoutes } from '../../routes';
import Innholdslaster, { Avhengighet } from '../utils/Innholdslaster';

interface Props {
    className?: string;
    heading: string;
    subHeading?: string;
    feilmeldinger?: SerializedError[];
    children: ReactNode;
    avhengigheter?: Avhengighet[] | Avhengighet;
    minstEnAvhengighet?: boolean;
    contentClass?: string;
    onRequestClose?(): boolean;
    tilbakeLenke?: { tekst: string; onTilbakeKlikk: MouseEventHandler };
}

const Modal = (props: Props) => {
    const {
        heading,
        subHeading,
        children,
        avhengigheter,
        onRequestClose,
        minstEnAvhengighet = false,
        feilmeldinger,
        tilbakeLenke,
    } = props;

    const navigate = useNavigate();
    const { hovedsideRoute, nyAktivitetRoute } = useRoutes();

    const closeFuncOrDefault = () => {
        if (onRequestClose) {
            return onRequestClose();
        }
        navigate(hovedsideRoute());
        return true;
    };

    return (
        <AkselModal
            closeOnBackdropClick
            open
            onBeforeClose={closeFuncOrDefault}
            className="lg:w-120"
            aria-labelledby="modal-heading"
        >
            <AkselModal.Header closeButton={true}>
                <div className="space-y-2">
                    <Heading id="modal-heading" size="large">
                        {heading}
                    </Heading>
                    {tilbakeLenke ? (
                        <>
                            <ReactRouterLink
                                className="hover:cursor-pointer text-text-action underline"
                                to={nyAktivitetRoute()}
                                tabIndex={0}
                            >
                                {tilbakeLenke.tekst}
                            </ReactRouterLink>
                        </>
                    ) : null}
                </div>
            </AkselModal.Header>
            <AkselModal.Body>
                <div className="flex flex-col max-w-2xl mx-auto">
                    {subHeading ? (
                        <Heading className="" level="2" size="xsmall">
                            {subHeading}
                        </Heading>
                    ) : null}
                    {feilmeldinger && <Feilmelding feilmeldinger={feilmeldinger} />}
                    <Innholdslaster
                        className="flex m-auto my-8"
                        minstEn={minstEnAvhengighet}
                        avhengigheter={avhengigheter}
                    >
                        {children}
                    </Innholdslaster>
                </div>
            </AkselModal.Body>
        </AkselModal>
    );
};

export default Modal;
