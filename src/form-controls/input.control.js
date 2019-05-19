const controlStates = require('../control-states');
const validationStates = require('../validation-states');
const ErrorsStack = require('../errors-stack.class');
const StandardError = require('../standard-error.class');
const ValidityStateAdapter = require('../validty-state-adapter.class');
// Private members
const _element = new WeakMap();
const _controlState = new WeakMap();
const _validationState = new WeakMap();
const _canBeValidate = new WeakMap();
const _errorsStack = new WeakMap();
// Private methods
const _assignEvents = Symbol();
const _handleKeyup = Symbol();
const _handleBlur = Symbol();
const _setControlState = Symbol();
const _validateControlState = Symbol();
const _checkIsCandidateForValidation = Symbol();
const _setValidationState = Symbol();
const _validateValidationState = Symbol();
const _renderErrors = Symbol();
const _handleInput = Symbol();

class InputControl {
    constructor(element) {
        _element.set(this, element);

        // Init state of the control
        this[_setControlState](controlStates.PRISTINE);

        // Init errors stack
        _errorsStack.set(this, new ErrorsStack());

        this[_checkIsCandidateForValidation]();

        // Subscribe for events
        this[_assignEvents]();
    }

    [_assignEvents]() {

        // Listen for keyup event
        _element.get(this).addEventListener('keyup', this[_handleKeyup].bind(this));

        // Listen for blur event
        _element.get(this).addEventListener('blur', this[_handleBlur].bind(this));

        _element.get(this).addEventListener('input', this[_handleInput].bind(this));

    }

    [_handleKeyup](event) {
        _controlState.get(this) !== controlStates.DIRTY && this[_setControlState](controlStates.DIRTY);
        this.validate();
    }

    [_handleBlur](event) {
        const currentState = _controlState.get(this);
        currentState !== controlStates.DIRTY && this[_setControlState](controlStates.TOUCHED);
        this.validate();
    }

    [_handleInput]() {
        this.validate();
    }

    [_setControlState](state) {
        this[_validateControlState](state);
        _controlState.set(this, state);
        // Clear previous css classes
        Object.values(controlStates).forEach(c => _element.get(this).classList.remove(c));
        // Add fresh css class
        _element.get(this).classList.add(state);
    }

    [_validateControlState](state) {
        const result = Object.values(controlStates).some(s => s === state);
        if (!result) {
            throw new Error('wrong state has been passed');
        }
    }

    [_validateValidationState](state) {
        const result = Object.values(validationStates).some(s => s === state);
        if (!result) {
            throw new Error('wrong validation state has been passed');
        }
    }

    /**
     * @desc Checks if the form control is a candidate for validation if it doesn't it sets the appropriate value to the variable _canBeValidate
     * @return {boolean}
     */
    [_checkIsCandidateForValidation]() {
        const canBeValidate = _element.get(this).willValidate;
        _canBeValidate.set(this, canBeValidate);
        return canBeValidate;
    }

    [_setValidationState](state) {
        this[_validateValidationState](state);
        _validationState.set(this, state);
        Object.values(validationStates).forEach(s => _element.get(this).classList.remove(s));
        _element.get(this).classList.add(state);
    }

    [_renderErrors]() {
        const firstOne = _errorsStack.get(this).first();
        if (firstOne) {
            const errorLabel = document.createElement('span');
            errorLabel.classList.add('error-label');
            errorLabel.innerText = firstOne.message;
            _element.get(this).parentNode.append(errorLabel);
        }
    }

    // Public API

    /**
     * @desc Validate control
     */
    validate() {
        // Check by default Constraint Validation API
        let valid = _element.get(this).checkValidity();

        // Clear error stack and remove error labels
       this.reset();

        // Assign custom validation errors
        // TODO:

        if (!valid) {
            const validity = _element.get(this).validity;

            // Assign browser validation error
            const validityStateAdapter = new ValidityStateAdapter(validity, _element.get(this));
            validityStateAdapter.errors.length && _errorsStack.get(this).push(validityStateAdapter.errors.first());

            this[_renderErrors]();

        }

        // Set appropriate state
        this[_setValidationState](valid ? validationStates.VALID : validationStates.INVALID);

        return _validationState.get(this);
    }

    /**
     * @desc Make control clear
     */
    reset() {
        _errorsStack.get(this).clear();
        const errorLabels = _element.get(this).parentNode.querySelectorAll('span.error-label');
        errorLabels.length && [].forEach.call(errorLabels, lbl => lbl.remove());
    }
}

module.exports = InputControl;
