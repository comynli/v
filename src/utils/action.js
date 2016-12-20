const REQUEST = 'REQUEST';
const SUCCESS = 'SUCCESS';
const FAILURE = 'FAILURE';

export function createRequestTypes(base) {
    return [REQUEST, SUCCESS, FAILURE].reduce((acc, type) => {
        acc[type] = `${type}@${base}`;
        return acc;
    }, {});
}

export function action(type, payload = {}) {
    return {type, ...payload};
}
