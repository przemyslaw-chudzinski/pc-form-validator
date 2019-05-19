const StandardError = require('./standard-error.class');
// Private members
const _stack = new WeakMap();
// Private methods
// const

class ErrorsStack {

    constructor() {
        _stack.set(this, []);
    }

    push(error) {
        if (!(error instanceof StandardError)) {
            throw new Error('error must be an instance of StandardError class');
        }

        _stack.get(this).push(error);

    }

    first() {
        return _stack.get(this).length ? _stack.get(this)[0] : null;
    }

    clear() {
        _stack.set(this, []);
    }

    item(index) {
        return _stack.get(this).length && _stack.get(this)[index] ? _stack.get(this)[index] : null;
    }

    get length() {
        return _stack.get(this).length;
    }

}

module.exports = ErrorsStack;
