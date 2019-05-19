// Private members
const _stack = new WeakMap();

class ControlsStack {

    constructor() {
        _stack.set(this, []);
    }

    push(inputControl) {
        // TODO: Add entry validation
        _stack.get(this).push(inputControl);
    }

    get length() {
        return +_stack.get(this).length;
    }

    forEach(callback = () => {}) {
        _stack.get(this).forEach(callback);
    }

    findByAttr(attribute, value) {
        let result = null;
        this.forEach(inputControl => {
            const nativeElement = inputControl.nativeElement;
            if (nativeElement.hasAttribute(attribute) && nativeElement.getAttribute(attribute) === value) {
                return result = inputControl;
            }
        });
        return result;
    }

}

module.exports = ControlsStack;
