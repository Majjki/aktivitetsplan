import React, { useContext } from 'react';
import PT from 'prop-types';
import * as AppPT from '../../../proptypes';
import { STATUS_FULLFOERT, STATUS_AVBRUTT } from '../../../constant';
import { DirtyContext } from '../../context/dirty-context';
import Modal from '../../../felles-komponenter/modal/modal';
import ModalHeader from '../../../felles-komponenter/modal/modal-header';

function header(valgtAktivitet) {
    if (!valgtAktivitet) {
        return null;
    }

    const aktivitetErLaast =
        valgtAktivitet.status === STATUS_FULLFOERT ||
        valgtAktivitet.status === STATUS_AVBRUTT;

    return (
        <ModalHeader
            normalTekstId="aktivitetvisning.header"
            normalTekstValues={{
                status: valgtAktivitet.status,
                type: valgtAktivitet.type,
            }}
            aria-labelledby="modal-aktivitetsvisning-header"
            aktivitetErLaast={aktivitetErLaast}
        />
    );
}

const DIALOG_TEKST =
    'Alle endringer blir borte hvis du ikke lagrer. Er du sikker på at du vil lukke siden?';

function AktivitetvisningModal(props) {
    const { aktivitet, avhengigheter, history, children } = props;

    const dirty = useContext(DirtyContext);

    return (
        <Modal
            contentLabel="aktivitetsvisning-modal"
            contentClass="aktivitetsvisning"
            avhengigheter={avhengigheter}
            header={header(aktivitet)}
            onRequestClose={() => {
                if (!dirty.isDirty || window.confirm(DIALOG_TEKST)) {
                    history.push('/');
                }
            }}
        >
            {children}
        </Modal>
    );
}

AktivitetvisningModal.defaultProps = {
    aktivitet: undefined,
};

AktivitetvisningModal.propTypes = {
    aktivitet: AppPT.aktivitet,
    avhengigheter: AppPT.avhengigheter.isRequired,
    history: AppPT.history.isRequired,
    children: PT.object.isRequired,
};

export default AktivitetvisningModal;