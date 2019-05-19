const controlStates = require('../control-states');
const validationStates = require('../validation-states');
const InputControl = require('./input.control');
// Private members
const _element = new WeakMap();
const _controlState = new WeakMap();
const _validationState = new WeakMap();
const _canBeValidate = new WeakMap();
// Private methods
const _setControlState = Symbol();
const _validateControlState = Symbol();
const _checkIsCandidateForValidation = Symbol();
const _assignEvents = Symbol();
const _handleInputEvent = Symbol();
const _setValidationState = Symbol();
const _validateValidationState = Symbol();

// class InputCheckboxControl {
//     constructor(element) {
//         _element.set(this, element);
//
//         // Init state of the control
//         this[_setControlState](controlStates.PRISTINE);
//
//         this[_checkIsCandidateForValidation]();
//
//         // Assign events
//         this[_assignEvents]();
//
//     }
//
//     [_assignEvents]() {
//
//         _element.get(this).addEventListener('input', this[_handleInputEvent].bind(this));
//
//     }
//
//     [_setControlState](state) {
//         this[_validateControlState](state);
//         _controlState.set(this, state);
//         // Clear previous css classes
//         Object.values(controlStates).forEach(c => _element.get(this).classList.remove(c));
//         // Add fresh css class
//         _element.get(this).classList.add(state);
//     }
//
//     [_validateControlState](state) {
//         const result = Object.values(controlStates).some(s => s === state);
//         if (!result) {
//             throw new Error('wrong state has been passed');
//         }
//     }
//
//     /**
//      * @desc Checks if the form control is a candidate for validation if it doesn't it sets the appropriate value to the variable _canBeValidate
//      * @return {boolean}
//      */
//     [_checkIsCandidateForValidation]() {
//         const canBeValidate = _element.get(this).willValidate;
//         _canBeValidate.set(this, canBeValidate);
//         return canBeValidate;
//     }
//
//     [_handleInputEvent](event) {
//         _controlState.get(this) !== controlStates.DIRTY && this[_setControlState](controlStates.DIRTY);
//         this.validate();
//     }
//
//     [_setValidationState](state) {
//         this[_validateValidationState](state);
//         _validationState.set(this, state);
//         Object.values(validationStates).forEach(s => _element.get(this).classList.remove(s));
//         _element.get(this).classList.add(state);
//     }
//
//     [_validateValidationState](state) {
//         const result = Object.values(validationStates).some(s => s === state);
//         if (!result) {
//             throw new Error('wrong validation state has been passed');
//         }
//     }
//
//     // Public API
//
//     validate() {
//         const valid = _element.get(this).checkValidity();
//         this[_setValidationState](valid ? validationStates.VALID : validationStates.INVALID);
//     }
//
//     reset() {
//
//     }


class InputCheckboxControl extends InputControl {
    constructor(element) {
        super(element);
    }
}

module.exports = InputCheckboxControl;
