const StandardError = require('../standard-error.class');
const cssClasses = require('../css-classes');

const validateState = (state, stack = {}) => {
    const result = Object.values(stack).some(s => s === state);
    if (!result) {
        throw new Error('wrong validation state has been passed');
    }
};

const clearErrorLabels = (control) => {
    const errorLabels = control.parentNode.querySelectorAll('span.' + cssClasses.errorLabel);
    errorLabels.length && [].forEach.call(errorLabels, lbl => lbl.remove());
};

const createErrorLabel = error => {
    if (!(error instanceof StandardError)) {
        throw new Error('error must an instance of the StandardError class');
    }
    const errorLabel = document.createElement('span');
    errorLabel.classList.add(cssClasses.errorLabel);
    errorLabel.innerText = error.message;
    return errorLabel;
};

module.exports = {
    validateState,
    clearErrorLabels,
    createErrorLabel
};
