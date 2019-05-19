const PcFormValidator = require('./pc-form-validator.class');

if (!('PcFormValidator' in window)) {
    window.PcFormValidator = PcFormValidator;
}
