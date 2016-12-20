export default class Module {
    static props = {};

    constructor(ctx) {
        this.ctx = ctx;
    }

    get name() {
        if (this.constructor.props.hasOwnProperty('name')) {
            return this.constructor.props.name;
        } else {
            throw new Error('no name property');
        }
    }

    get router() {
        if (this.constructor.props.hasOwnProperty('router')) {
            return this.constructor.props.router;
        } else {
            throw new Error('no router property');
        }
    }

    start() {
        throw new Error('not implemented');
    }
}