const controlStates = require('../control-states');
const validationStates = require('../validation-states');
const StandardError = require('../standard-error.class');
const ValidityStateAdapter = require('../validty-state-adapter.class');
const {ExtraValidationStack, ErrorsStack} = require('../stacks');
const cssClasses = require('../css-classes');
const {
    validateState,
    clearErrorLabels,
    createErrorLabel
} = require('./form-control-support');
// Private members
const _element = new WeakMap();
const _controlState = new WeakMap();
const _validationState = new WeakMap();
const _canBeValidate = new WeakMap();
const _errorsStack = new WeakMap();
const _extraValidationStack = new WeakMap();
// Private methods
const _assignEvents = Symbol();
const _handleKeyup = Symbol();
const _handleBlur = Symbol();
const _setControlState = Symbol();
const _checkIsCandidateForValidation = Symbol();
const _setValidationState = Symbol();
const _renderErrors = Symbol();
const _handleInput = Symbol();
const _canApplyValidator = Symbol();
const _clearValidation = Symbol();
const _validateWithExtraValidator = Symbol();

class InputControl {
    constructor(element, extraValidationStack = new ExtraValidationStack()) {

        // Validate entry values
        if (!(extraValidationStack instanceof ExtraValidationStack)) {
            throw new Error('extraValidationStack must be an instance of ExtraValidationStack');
        }

        // Assign private members
        _element.set(this, element);
        _extraValidationStack.set(this, extraValidationStack);
        // Init errors stack
        _errorsStack.set(this, new ErrorsStack());

        // Init state of the control
        this[_setControlState](controlStates.PRISTINE);

        this[_checkIsCandidateForValidation]();

        // Subscribe for events
        this[_assignEvents]();
    }

    /**
     * @desc Assigns control events
     */
    [_assignEvents]() {

        // Listen for keyup event
        _element.get(this).addEventListener('keyup', this[_handleKeyup].bind(this));

        // Listen for blur event
        _element.get(this).addEventListener('blur', this[_handleBlur].bind(this));

        // Listen for input event
        _element.get(this).addEventListener('input', this[_handleInput].bind(this));

    }

    /**
     * @desc Callback for keyup event
     * @param event
     */
    [_handleKeyup](event) {
        _controlState.get(this) !== controlStates.DIRTY && this[_setControlState](controlStates.DIRTY);
        this.validate();
    }

    /**
     * @desc Callback for blur event
     * @param event
     */
    [_handleBlur](event) {
        const currentState = _controlState.get(this);
        currentState !== controlStates.DIRTY && this[_setControlState](controlStates.TOUCHED);
        this.validate();
    }

    /**
     * @desc Callback for input event
     */
    [_handleInput]() {
        this.validate();
    }

    /**
     * @desc Setter for control state
     * @param state
     */
    [_setControlState](state) {
        // check passed state is valid
        validateState(state, controlStates);
        // Assign current state
        _controlState.set(this, state);
        // Clear previous css classes
        Object.values(controlStates).forEach(c => _element.get(this).classList.remove(c));
        // Add fresh css class
        _element.get(this).classList.add(state);
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

    /**
     * @desc Setter for validation state
     * @param state
     */
    [_setValidationState](state) {
        validateState(state, validationStates);
        _validationState.set(this, state);
        Object.values(validationStates).forEach(s => _element.get(this).classList.remove(s));
        _element.get(this).parentNode.classList.remove(cssClasses.parentNodeIsInvalid);
        _element.get(this).parentNode.classList.remove(cssClasses.parentNodeIsValid);
        _element.get(this).classList.add(state);
        state === validationStates.INVALID ?
            _element.get(this).parentNode.classList.add(cssClasses.parentNodeIsInvalid) :
            _element.get(this).parentNode.classList.add(cssClasses.parentNodeIsValid);
    }

    /**
     * @desc Renders the first error from the errors stack
     */
    [_renderErrors]() {
        const firstOne = _errorsStack.get(this).first();
        firstOne && _element.get(this).parentNode.append(createErrorLabel(firstOne));
    }

    /**
     * @desc Checks extra validator can be applied
     * @param ruleObject
     * @return {boolean}
     */
    [_canApplyValidator](ruleObject) {
        return _element.get(this).hasAttribute(ruleObject.attr);
    }

    /**
     * @desc Clears validation effects
     */
    [_clearValidation]() {
        // Clear errors stack
        _errorsStack.get(this).clear();
        // Remove error labels
        clearErrorLabels(_element.get(this));
    }

    /**
     * @desc Validates with extra validators
     * @param ruleObject
     * @return {boolean}
     */
    [_validateWithExtraValidator](ruleObject) {
        if (!this[_canApplyValidator](ruleObject)) {
            return false;
        }

        const result = ruleObject.validator.call(
            this,
            _element.get(this).value,
            _element.get(this),
            _element.get(this).getAttribute(ruleObject.attr)
        );

        if (result instanceof StandardError) {
            _errorsStack.get(this).push(result);
            return true;
        }

        return false;
    }

    // Public API

    /**
     * @desc Validate control
     * @return {any}
     */
    validate() {
        // Clear error stack and remove error labels
        this[_clearValidation]();

        // Check by default Constraint Validation API
        let valid = _element.get(this).checkValidity();

        // Assign custom validation errors
        const extraValidationStack = _extraValidationStack.get(this);
        extraValidationStack.length && extraValidationStack.forEach(ruleObject =>
            this[_validateWithExtraValidator](ruleObject) && (valid = false));

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
     * todo: implement correctly
     */
    reset() {
        // Clear errors stack
        _errorsStack.get(this).clear();
        // Remove error labels
        clearErrorLabels(_element.get(this));
        // Sets appropriate states
        // TODO: I dont know how to set it. I will go over
        // this[_setValidationState](validationStates.VALID);
        this[_setControlState](controlStates.PRISTINE);

    }
}

module.exports = InputControl;
