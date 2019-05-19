const controlTypes = require('./control-types');
const validationStates = require('./validation-states');
const {
    InputControl,
    InputEmailControl,
    InputCheckboxControl
} = require('./form-controls');
// Private members
const _formElem = new WeakMap();
const _stackControls = new WeakMap();
// Private methods
const _setup = Symbol();
const _getFormControls = Symbol();
const _initFormControls = Symbol();
const _assignEvents = Symbol();
const _handleSubmit = Symbol();
const _initControl = Symbol();

class PcFormValidator {

    constructor(selector) {
        const formElem = document.querySelector(selector);
        if (!formElem) {
            throw new Error('There is not any form which match to given selector');
        }
        // Assign form to the private member
        _formElem.set(this, formElem);

        // Init stack of the controls
        _stackControls.set(this, []);

        // Prepare form
        this[_setup]();

        // Assign events
        this[_assignEvents]();
    }

    [_setup]() {

        // Add novalidate attribute to the form element
        _formElem.get(this).setAttribute('novalidate', '');

        this[_initFormControls]();

    }

    // Assign form events
    [_assignEvents]() {

        _formElem.get(this).addEventListener('submit', this[_handleSubmit].bind(this));

    }

    /**
     * @desc Returns form controls
     * @return {NodeListOf<SVGElementTagNameMap[string]> | NodeListOf<HTMLElementTagNameMap[string]> | NodeListOf<Element>}
     */
    [_getFormControls]() {
      return _formElem.get(this).querySelectorAll('input[data-form-control], textarea[data-form-control], select[data-form-control]');
    }

    [_initFormControls]() {
        const controls = this[_getFormControls]();
        !(!controls || !controls.length || !controls.forEach(control => this[_initControl](control)));
    }

    [_initControl](control) {

        switch (control.type) {
            case controlTypes.EMAIL:
                return _stackControls.get(this).push(new InputEmailControl(control));
            case controlTypes.CHECKBOX:
                return _stackControls.get(this).push(new InputCheckboxControl(control));
            default:
                return _stackControls.get(this).push(new InputControl(control));
        }

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

    reset() {
        _stackControls.get(this).forEach(controlInstance => controlInstance.reset());
    }

    // destroy() {
    //
    // }

}

module.exports = PcFormValidator;
