// Private members
const _message = new WeakMap();

class StandardError {

    constructor(message) {
        if (typeof message !== "string") {
            throw new Error('message must be string type');
        }

        _message.set(this, message);

    }

    get message() {
        return _message.get(this);
    }

}

module.exports = StandardError;
