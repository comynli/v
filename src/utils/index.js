export {createRequestTypes, action} from './action';
export {publish} from './reducer';
export {request} from './request';

export function subscribe(ns, mapping) {
    return state => {
        let _state = state;
        for (let prop of ns.split('.')) {
            _state = _state[prop];
        }
        const ret = {};
        Object.entries(mapping).forEach(it => {
            const [name, key] = it;
            ret[name] = _state[key];
        });
        return ret;
    };
}