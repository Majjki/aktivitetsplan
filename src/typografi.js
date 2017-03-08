import React, { PropTypes as PT } from 'react';
import classNames from 'classnames';

export const typeConfigMap = {
    sidetittel: { defaultTag: 'h1', cls: (...args) => classNames('typo-sidetittel', ...args) },
    innholdstittel: { defaultTag: 'h2', cls: (...args) => classNames('typo-innholdstittel blokk-l', ...args) },
    undertittel: { defaultTag: 'h3', cls: (...args) => classNames('typo-undertittel', ...args) },
    etikettStor: { defaultTag: 'p', cls: (...args) => classNames('typo-etikett-stor', ...args) },
    element: { defaultTag: 'p', cls: (...args) => classNames('typo-element', ...args) },
    avsnitt: { defaultTag: 'p', cls: (...args) => classNames('typo-avsnitt', ...args) },
    etikettLiten: { defaultTag: 'p', cls: (...args) => classNames('typo-etikett-liten', ...args) },
    undertekst: { defaultTag: 'p', cls: (...args) => classNames('typo-undertekst', ...args) },
    infotekst: { defaultTag: 'p', cls: (...args) => classNames('typo-infotekst', ...args) },
    normal: { defaultTag: 'p', cls: (...args) => classNames('typo-normal', ...args) }
};

function getConfigForType(type) {
    const typeConfig = typeConfigMap[type];

    if (!typeConfig) {
        throw new Error(
            `Kunne ikke finne typeconfig for ${type}. Støttede typer er: ${JSON.stringify(Object.keys(typeConfigMap))}`
        );
    }

    return typeConfig;
}

function TypografiBase({ type, tag, className, children, ...props }) {
    const config = getConfigForType(type);
    const tagName = tag || config.defaultTag;

    const classnames = { className: config.cls(className) };

    return React.createElement(tagName, { ...props, ...classnames }, children);
}

TypografiBase.propTypes = {
    type: PT.string.isRequired,
    tag: PT.string,
    className: PT.string,
    children: PT.node.isRequired
};

export default TypografiBase;

export const Sidetittel = (props) => <TypografiBase type="sidetittel" {...props} />;
export const Innholdstittel = (props) => <TypografiBase type="innholdstittel" {...props} />;
export const Undertittel = (props) => <TypografiBase type="undertittel" {...props} />;
export const EtikettStor = (props) => <TypografiBase type="etikettStor" {...props} />;
export const Element = (props) => <TypografiBase type="element" {...props} />;
export const Avsnitt = (props) => <TypografiBase type="avsnitt" {...props} />;
export const EtikettLiten = (props) => <TypografiBase type="etikettLiten" {...props} />;
export const Undertekst = (props) => <TypografiBase type="undertekst" {...props} />;
export const Infotekst = (props) => <TypografiBase type="infotekst" {...props} />;
export const Normaltekst = (props) => <TypografiBase type="normal" {...props} />;
