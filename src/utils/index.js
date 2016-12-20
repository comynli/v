export {createRequestTypes, action} from './action';
export {publish} from './reducer';
export {request} from './request';
import {ROOT} from './reducer';

export function subscribe(mapping, selectors = undefined) {
    return state => {
        const ret = {};
        Object.entries(mapping).forEach(it => {
            const [name, key] = it;
            ret[name] = state[ROOT][key];
        });
        if (selectors) {
            Object.entries(selectors).forEach(it => {
                const [name, key] = it;
                ret[name] = state[key];
            });
        }
        return ret;
    };
}