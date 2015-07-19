class $ {
    constructor (selector, parent) {
        if (selector instanceof $) {
            this.elements = selector.get();
        } else if (typeof selector == 'string') {
            if (parent instanceof $) parent = parent.get(0);
            this.elements = [].slice.call((parent || document).querySelectorAll(selector));
        } else if (selector instanceof Array) {
            this.elements = selector;
        } else {
            this.elements = [selector];
        }
    }

    get (index) {
        return index === undefined ? this.elements : this.elements[index];
    }

    each (callback) {
        this.elements.forEach(callback);
        return this;
    }

    on (eventName, callback) {
        this.each(element => {
            element.addEventListener(eventName, callback, ['focus', 'blur'].indexOf(eventName) > -1);
        });

        return this;
    }

    addClass (className) {
        this.each(element => { element.classList.add(className); });
        return this;
    }

    removeClass (className) {
        this.each(element => { element.classList.remove(className); });
        return this;
    }

    show () {
        this.removeClass('gentle-hide');
        return this;
    }

    hide () {
        this.addClass('gentle-hide');
        return this;
    }

    getAttr (attr) {
        return this.get(0).getAttribute(attr);
    }

    setAttr (attr, value) {
        this.each(element => {
            element.setAttribute(attr, value);
        });

        return this;
    }

    concat (selector, parent) {
        this.elements = this.elements.concat(new $(selector, parent).get());
        return this;
    }

    setState (stateName, stateValue) {
        if (stateValue === undefined) throw('No stateValue passed to $.setState()');

        this.each(element => {
            if (!element.gentleState) element.gentleState = {};
            element.gentleState[stateName] = stateValue;
        });

        let className = 'gentle-state-' + stateName;
        let $reflectors = new $(`[data-gentle-state-for="${this.getAttr('name')}"]`, this.get(0));

        if (stateValue) {
            this.addClass(className);
            $reflectors.addClass(className);
        } else {
            this.removeClass(className);
            $reflectors.removeClass(className);
        }

        return this;
    }

    getState (stateName) {
        let element = this.get(0);
        return element.gentleState ? element.gentleState[stateName] : null;
    }

    getValue () {
        return this.get(0).value;
    }

    isValid () {
        return this.get(0).checkValidity();
    }

    getErrors () {
        let element = this.get(0);
        let errors = {};

        for (let error in element.validity) {
            if (error == 'valid') errors.invalid = !element.validity.valid;
            else errors[error] = element.validity[error];
        }

        if (typeof errors.invalid != 'boolean') errors.invalid = !element.checkValidity();

        return errors;
    }
}

export default (selector, parent) => {
    return new $(selector, parent);
};