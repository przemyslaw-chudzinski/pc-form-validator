const StandardError = require('../standard-error.class');
// Private members
const _stack = new WeakMap();
// Private methods

class ErrorsStack {

    constructor() {
        // Init empty stack
        _stack.set(this, []);
    }

    /**
     * @desc Pushes single error instance to the stack
     * @param error
     */
    push(error) {
        // Validate entry values
        if (!(error instanceof StandardError)) {
            throw new Error('error must be an instance of StandardError class');
        }

        _stack.get(this).push(error);

    }

    /**
     * @desc Returns first element from the stack
     * @return {null | StandardError}
     */
    first() {
        return _stack.get(this).length ? _stack.get(this)[0] : null;
    }

    /**
     * @desc Clears all stack
     */
    clear() {
        _stack.set(this, []);
    }

    /**
     * @desc Returns element with given index from the stack
     * @param index
     * @return {StandardError | null}
     */
    item(index) {
        return _stack.get(this).length && _stack.get(this)[index] ? _stack.get(this)[index] : null;
    }

    /**
     * @desc Returns number of elements from the stack
     * @return {number}
     */
    get length() {
        return +_stack.get(this).length;
    }

}

module.exports = ErrorsStack;
