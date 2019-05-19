const StandardError = require('./standard-error.class');
const ErrorsStack = require('./errors-stack.class');
// Private members
const _validity = new WeakMap();
const _errors = new WeakMap();
const _controlElement = new WeakMap();
// Private methods
const _check = Symbol();
const _getUserMessage = Symbol();

class ValidityStateAdapter {
    constructor(validity, controlElement) {
        if (!(validity instanceof ValidityState)) {
            throw new Error('validity must be an instance of ValidityState interface');
        }

        if (!controlElement) {
            throw new Error('controlElement must be specified');
        }

        _errors.set(this, new ErrorsStack());

        _validity.set(this, validity);
        _controlElement.set(this, controlElement);

        this[_check]();

    }

    [_check]() {

        const validity = _validity.get(this);

        if (validity.valueMissing) {
            let message = 'This field is required';
            message = this[_getUserMessage]('required') || message;
            _errors.get(this).push(new StandardError(message));
        }

        if (validity.tooShort) {
            const minlength = _controlElement.get(this).minLength;
            let message = 'Value is too short. Value must have ' + minlength + ' characters at least';
            message = this[_getUserMessage]('minlength') || message;
            _errors.get(this).push(new StandardError(message));
        }

        if (validity.tooLong) {
            const maxlength = _controlElement.get(this).maxLength;
            let message = 'Value is too long. Value must have ' + maxlength + ' characters at most';
            message = this[_getUserMessage]('maxlength') || message;
            _errors.get(this).push(new StandardError(message));
        }

        if (validity.rangeUnderflow) {
            const min = _controlElement.get(this).min;
            let message = 'Value must be greater than or equal ' + min;
            message = this[_getUserMessage]('min') || message;
            _errors.get(this).push(new StandardError(message));
        }

        if (validity.rangeOverflow) {
            const max = _controlElement.get(this).max;
            let message = 'Value must be less than or equal ' + max;
            message = this[_getUserMessage]('max') || message;
            _errors.get(this).push(new StandardError(message));
        }

        if (validity.patternMismatch) {
            let message = 'Field is invalid';
            message = this[_getUserMessage]('pattern') || message;
            _errors.get(this).push(new StandardError(message));
        }

        if (validity.stepMismatch) {
            // TODO
            _errors.get(this).push(new StandardError('Field is invalid'));
        }

        if (validity.typeMismatch) {
            // TODO
            _errors.get(this).push(new StandardError('Field is invalid'));
        }

        if (validity.badInput) {
            // TODO
            _errors.get(this).push(new StandardError('Field has bad input'));
        }

    }

    [_getUserMessage](key) {
        const data = _controlElement.get(this).dataset;
        let result = null;
        const index = 'message' + key.charAt(0).toUpperCase() + key.slice(1);

        Object.keys(data).forEach(k => {
            if (index === k) {
                result = data[index];
            }
        });
        return result;
    }

    // Public API

    get errors() {
        return _errors.get(this);
    }
}

module.exports = ValidityStateAdapter;
