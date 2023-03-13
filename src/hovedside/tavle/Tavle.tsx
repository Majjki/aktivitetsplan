import { Back, Next } from '@navikt/ds-icons';
import classNames from 'classnames';
import React, { ReactElement, useRef, useState } from 'react';

import SprettendeScrollbars from './sprettende-scrollbars';

const KOLONNEBREDDE = 300;
const KOLONNEMARGIN = 10;

interface Props {
    children: ReactElement[];
}

const Tavle = (props: Props) => {
    const { children } = props;

    const [currentIndex, setCurrentIndex] = useState(0);
    const [clickIndex, setClickIndex] = useState(0);
    const [venstreKnappDisabled, setVenstreKnappDisabled] = useState(true);
    const [hoyreKnappDisabled, setHoyreKnappDisabled] = useState(false);

    const scrollbars = useRef<SprettendeScrollbars>(null);

    const visForrige = () => {
        const newClickIndex = Math.min(currentIndex, clickIndex) - 1;
        const scrollTo = newClickIndex * KOLONNEBREDDE;
        scrollbars.current?.scrollLeft(scrollTo);
        setClickIndex(newClickIndex);
    };

    const visNeste = () => {
        if (!scrollbars.current) {
            return;
        } else {
            const clientWidth = scrollbars.current.getClientWidth();
            const scrollLeft = scrollbars.current.getScrollLeft();
            const clientWidthWithOffset = clientWidth!! + KOLONNEMARGIN;
            const nesteIndex = Math.floor((clientWidthWithOffset + scrollLeft!!) / KOLONNEBREDDE);
            const newClickIndex = Math.max(nesteIndex, clickIndex) + 1;
            const scrollTo = newClickIndex * KOLONNEBREDDE - clientWidthWithOffset;
            scrollbars.current?.scrollLeft(scrollTo);
            setClickIndex(newClickIndex);
        }
    };

    const updateState = (values: { scrollLeft: number; left: number }) => {
        setCurrentIndex(Math.ceil(values.scrollLeft / KOLONNEBREDDE));
        setVenstreKnappDisabled(values.left === 0);
        setHoyreKnappDisabled(values.left >= 0.99);
    };

    const kolonner = children.map((child, index) => (
        <section
            key={child.key || index}
            className="tavle-kolonne"
            data-testid={`aktivitetstavle.${child.props.status}`}
        >
            {child}
        </section>
    ));

    const venstreKnapp = (
        <button
            type="button"
            className={classNames('tavle__scrollknapp knapp-forrige', {
                invisible: venstreKnappDisabled,
            })}
            onClick={visForrige}
            disabled={venstreKnappDisabled}
            aria-label="Flytt visning en kolonne til venstre"
        >
            <Back className="knapp-forrige-ikon" aria-describedby="Forrige kolonne" role="img" focusable="false" />
        </button>
    );

    const hoyreKnapp = (
        <button
            type="button"
            className={classNames('tavle__scrollknapp knapp-neste', {
                invisible: hoyreKnappDisabled,
            })}
            onClick={visNeste}
            hidden={hoyreKnappDisabled}
            aria-label="Flytt visning en kolonne til høyre"
        >
            <Next className="knapp-neste-ikon" aria-describedby="Neste kolonne" role="img" focusable="false" />
        </button>
    );

    return (
        <section className={'aktivitetstavle tavle'} tabIndex={-1}>
            {venstreKnapp}
            <SprettendeScrollbars autoHeight autoHeightMax={9999} onScrollFrame={updateState} ref={scrollbars}>
                <div className="kolonner opacity-100">{kolonner}</div>
            </SprettendeScrollbars>
            {hoyreKnapp}
        </section>
    );
};

export default Tavle;
