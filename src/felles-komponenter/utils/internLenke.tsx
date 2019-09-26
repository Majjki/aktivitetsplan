import React, { ReactNode } from 'react';
import classNames from 'classnames';
import { Link } from 'react-router-dom';
import { getFodselsnummer } from '../../bootstrap/fnr-util';

const cls = (className, lenkeType, brukLenkestyling) =>
    classNames(className, lenkeType, {
        lenke: brukLenkestyling
    });

interface InternLenkeProps {
    href: string;
    className?: string;
    skipStyling?: boolean;
    children?: ReactNode;
    onClick?: () => void;
    role?: string;
}

export default function InternLenke(props: InternLenkeProps) {
    const fodselsnummer = getFodselsnummer();
    const internHref = (fodselsnummer ? `/${fodselsnummer}` : '') + props.href;

    return (
        <Link
            to={internHref}
            className={cls(props.className, 'internlenke', !props.skipStyling)}
            onClick={props.onClick}
            role={props.role}
        >
            {props.children}
        </Link>
    );
}
