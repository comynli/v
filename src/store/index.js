if (process.env.NODE_ENV === 'production') {
    module.exports = require('./configure.prod').default;
} else {
    module.exports = require('./configure.dev').default;
}