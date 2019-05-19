// Private members
const _stack = new WeakMap();

class ExtraValidationStack {

    constructor() {

        // Init empty stack
        _stack.set(this, []);
    }

    /**
     * Pushes single object to the stack
     * @param ruleObject
     */
    push(ruleObject) {

        _stack.get(this).push(ruleObject);

    }

    /**
     * @desc Returns number of elements
     * @return {number}
     */
    get length() {

        return +_stack.get(this).length;

    }

    /**
     * @param callback
     */
    forEach(callback = () => {}) {

        _stack.get(this).forEach(callback);

    }

}

module.exports = ExtraValidationStack;
