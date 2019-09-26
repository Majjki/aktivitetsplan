import React from 'react';
import { VenstreChevron } from 'nav-frontend-chevron';
import InternLenke from '../utils/internLenke';

export default function Tilbakeknapp(props) {
    const { tekst, onClick } = props;
    return (
        <InternLenke href="/" onClick={onClick} className="tilbakeknapp">
            <div className="tilbakeknapp-innhold">
                <VenstreChevron />
                <span className="tilbakeknapp-innhold__tekst">{tekst}</span>
            </div>
        </InternLenke>
    );
}
