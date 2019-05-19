// Private members
const _message = new WeakMap();

class StandardError {

    constructor(message) {
        // Validate entry values
        if (typeof message !== "string") {
            throw new Error('message must be string type');
        }

        // Assign private members
        _message.set(this, message);

    }

    /**
     * @desc Returns error message
     * @return {string}
     */
    get message() {
        return _message.get(this);
    }

}

module.exports = StandardError;
