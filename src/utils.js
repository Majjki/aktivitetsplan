export function autobind(ctx) {
    Object.getOwnPropertyNames(ctx.constructor.prototype)
        .filter((prop) => typeof ctx[prop] === 'function')
        .forEach((method) => {
            // eslint-disable-next-line
            ctx[method] = ctx[method].bind(ctx);
        });
}

function s4() {
    return Math.floor((1 + Math.random()) * 0x10000)
        .toString()
        .substring(1);
}

export function guid() {
    return `${s4()}${s4()}-${s4()}-${s4()}-${s4()}-${s4()}${s4()}${s4()}`;
}

export function fn(value) {
    return typeof value === 'function' ? value : () => value;
}

export function addPropToObject(obj, [key, value]) {
    obj[key] = value; // eslint-disable-line no-param-reassign
    return obj;
}

export function omit(obj, ...props) {
    return Object.entries(obj)
        .filter(([key]) => !props.includes(key))
        .reduce(addPropToObject, {});
}

export function clamp(lower, upper, numberish) {
    const number = parseFloat(numberish);
    if (number < lower)return lower;
    if (number > upper)return upper;
    return number;
}
