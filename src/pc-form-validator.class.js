const validationStates = require('./validation-states');
const controlStates = require('./control-states');
const {
    ExtraValidationStack,
    ControlsStack
} = require('./stacks');
const StandardError = require('./standard-error.class');
const {
    InputControl
} = require('./form-controls');
const {
    getFormControls,
    setNovalidateAttribute
} = require('./form-validator-support');
// Private members
const _formElem = new WeakMap();
const _stackControls = new WeakMap();
const _extraValidationStack = new WeakMap();
// Private methods
const _initFormControls = Symbol();
const _assignEvents = Symbol();
const _handleSubmit = Symbol();
const _initControl = Symbol();

class PcFormValidator {

    constructor(selector) {
        const formElem = document.querySelector(selector);

        if (!formElem) {
            throw new Error('There is not any form which match to the given selector');
        }
        // Assign form to the private member
        _formElem.set(this, formElem);

        // Init stack of the controls
        _stackControls.set(this, new ControlsStack());

        // Init extra validation stack
        _extraValidationStack.set(this, new ExtraValidationStack());

        // Add novalidate attribute to the form
        setNovalidateAttribute(_formElem.get(this));

        // Prepare form
        this[_initFormControls]();

        // Assign events
        this[_assignEvents]();
    }

    // Assign form events
    [_assignEvents]() {
        _formElem.get(this).addEventListener('submit', this[_handleSubmit].bind(this));
    }

    [_initFormControls]() {
        const controls = getFormControls(_formElem.get(this));
        !(!controls || !controls.length || !controls.forEach(control => this[_initControl](control)));
    }

    [_initControl](control) {
        _stackControls.get(this).push(new InputControl(control, _extraValidationStack.get(this)));
    }

    [_handleSubmit](event) {
        event.preventDefault();
        this.validate() === validationStates.VALID && _formElem.get(this).submit();
    }

    // Public API

    validate() {
        let validationState = validationStates.VALID;
        _stackControls.get(this).forEach(controlInstance => controlInstance.validate() === validationStates.INVALID && (validationState = validationStates.INVALID));
        return validationState;
    }

    /**
     * @desc Resets all form controls
     */
    reset() {
        _stackControls.get(this).forEach(controlInstance => controlInstance.reset());
    }

    /**
     * @desc Registers new validation rule
     * @param attr
     * @param validator
     */
    registerRule(attr, validator = () => {}) {
        if (typeof attr !== "string") {
            throw new Error('attr name must be type of string');
        }

        // Push to the extra validation stack new registered rule
        _extraValidationStack.get(this).push({
            attr,
            validator
        });
    }

    /**
     * @desc Returns support object
     * @return {{StandardError: StandardError, controlStates: ({DIRTY, TOUCHED, PRISTINE}|*), validationStates: ({VALID, INVALID}|*)}}
     */
    get support() {
        return {
            validationStates,
            controlStates,
            StandardError
        };
    }

    /**
     * @desc Returns stack of the controls
     * @return {ControlsStack}
     */
    get controls() {
        return _stackControls.get(this);
    }

}

module.exports = PcFormValidator;
