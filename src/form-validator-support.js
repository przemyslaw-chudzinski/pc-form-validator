const getFormControls = formElem => {
    if (!(formElem instanceof HTMLFormElement)) {
        throw new Error('formElem must be an instance of HTMLFormElement');
    }
    return formElem.querySelectorAll('input[data-form-control], textarea[data-form-control], select[data-form-control]');
};

const setNovalidateAttribute = formElem => {
    if (!(formElem instanceof HTMLFormElement)) {
        throw new Error('formElem must be an instance of HTMLFormElement');
    }

    formElem.setAttribute('novalidate', '');
};

module.exports = {
    getFormControls,
    setNovalidateAttribute
};
