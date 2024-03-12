import React, { FunctionComponent, useState } from 'react';
import { BodyShort, Button, Heading, Select } from '@navikt/ds-react';
import { Link as ReactRouterLink } from 'react-router-dom';
import {
    arkiver,
    hentPdfTilForhaandsvisning,
    selectArkivStatus,
    selectForhaandsvisningOpprettet,
} from '../verktoylinje/arkivering/arkivering-slice';
import { Status } from '../../createGenericSlice';
import { useRoutes } from '../../routes';
import useAppDispatch from '../../felles-komponenter/hooks/useAppDispatch';
import { useSelector } from 'react-redux';
import { selectVistOppfolgingsperiode } from '../aktivitet/aktivitetlisteSelector';
import { selectOppfolgingsPerioder } from '../oppfolging-status/oppfolging-selector';
import { formaterDatoKortManed, formaterDatoManed } from '../../utils/dateUtils';

const Sidebar: FunctionComponent = () => {
    const dispatch = useAppDispatch();
    const vistOppfolgingsperiode = useSelector(selectVistOppfolgingsperiode);
    const oppfolgingsperioder = useSelector(selectOppfolgingsPerioder);
    const forhaandsvisningOpprettet = useSelector(selectForhaandsvisningOpprettet);
    const arkivStatus = useSelector(selectArkivStatus);
    const arkiverer = [Status.PENDING, Status.RELOADING].includes(arkivStatus);
    const { hovedsideRoute } = useRoutes();
    const [valgtOppfolgingsperiode, setValgtOppfolgingsperiode] = useState(vistOppfolgingsperiode);

    const sendTilArkiv = () => {
        if (forhaandsvisningOpprettet) {
            dispatch(arkiver({ oppfolgingsperiodeId: vistOppfolgingsperiode!!.uuid, forhaandsvisningOpprettet }));
        }
    };

    const onEndretOppfolgingsperiode = (e: React.ChangeEvent<HTMLSelectElement>) => {
        dispatch(hentPdfTilForhaandsvisning(e.target.value));
    };

    return (
        <div className="items-start container space-y-4 max-w-96 py-8 px-8">
            <Heading size="large">Journalføring</Heading>
            <div className="print:border-none space-y-8 flex flex-col pb-4">
                <ReactRouterLink
                    className="text-text-action underline hover:no-underline"
                    to={hovedsideRoute()}
                    tabIndex={0}
                >
                    Til aktivitetsplanen
                </ReactRouterLink>
                <BodyShort>Aktiviteter og dialogtråder tilknyttet KVP blir ikke inkludert i journalføringen.</BodyShort>
                <Select label="Oppfølgingsperiode" onChange={onEndretOppfolgingsperiode}>
                    {[...oppfolgingsperioder]
                        .sort((a, b) => Date.parse(b.startDato) - Date.parse(a.startDato))
                        .map((periode, index) => (
                            <option
                                key={`oppfolgingsperiodeoption-${index}`}
                                value={periode.uuid}
                                selected={vistOppfolgingsperiode!!.uuid === periode.uuid}
                            >
                                {formaterDatoKortManed(periode.startDato)} - {formaterDatoKortManed(periode.sluttDato)}
                            </option>
                        ))}
                </Select>
                <Button
                    disabled={arkiverer || !forhaandsvisningOpprettet}
                    variant="primary"
                    onClick={() => sendTilArkiv()}
                >
                    Journalfør
                </Button>
            </div>
        </div>
    );
};

export default Sidebar;
