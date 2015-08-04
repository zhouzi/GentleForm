class $ {
    constructor (selector, parent = document) {
        if (selector instanceof $) {
            this.elements = selector.get();
        } else if (typeof selector == 'string') {
            if (parent instanceof $) parent = parent.get(0);
            this.elements = [].slice.call(parent.querySelectorAll(selector));
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

    on (event, callback) {
        let events = event.replace(/\s/g, '').split(',');

        this.each(element => {
            events.forEach(function (eventName) {
                element.addEventListener(eventName, callback, ['focus', 'blur'].indexOf(eventName) > -1);
            });
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
        this
            .aria('hidden', false)
            .removeClass('gentle-hide')
        ;

        return this;
    }

    hide () {
        this
            .aria('hidden', true)
            .addClass('gentle-hide')
        ;

        return this;
    }

    hasAttr (attr) {
        return this.get(0).hasAttribute(attr);
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

    setState (stateName, stateValue, parentForm = document) {
        if (stateValue === undefined) throw('No stateValue passed to $.setState()');

        this.each(element => {
            if (!element.gentleState) element.gentleState = {};
            element.gentleState[stateName] = stateValue;
        });

        let className = 'gentle-state-' + stateName;
        let $reflectors = new $(`[data-gentle-state-for="${this.getAttr('name')}"]`, parentForm);

        if (stateName == 'invalid') this.aria('invalid', stateValue);

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
        let $element = this;
        let element = $element.get(0);

        let apiErrors = [
            {
                name: 'patternMismatch',
                attribute: 'pattern',
                isInvalid: () => { return !(new RegExp($element.getAttr('pattern'))).test(element.value); }
            },

            {
                name: 'rangeOverflow',
                attribute: 'max',
                isInvalid: () => { return element.value > $element.getAttr('max'); }
            },

            {
                name: 'rangeUnderflow',
                attribute: 'min',
                isInvalid: () => { return element.value < $element.getAttr('min'); }
            },

            {
                name: 'tooShort',
                attribute: 'minlength',
                isInvalid: () => { return element.value.length < $element.getAttr('minlength'); }
            },

            {
                name: 'tooLong',
                attribute: 'maxlength',
                isInvalid: () => { return element.value.length > $element.getAttr('maxlength'); }
            },

            {
                name: 'valueMissing',
                attribute: 'required',
                isInvalid: () => {
                    let type = $element.getAttr('type');

                    if (type == 'checkbox') return !element.checked;
                    else if (type != 'radio') return element.value.length <= 0;

                    let name = $element.getAttr('name');
                    if (typeof name != 'string') return false;

                    let radios = new $(`[type="radio"][name="${name}"]`).get();

                    for (let i = 0, len = radios.length; i < len; i++) {
                        if (radios[i].checked) return false;
                    }

                    return true;
                }
            },

            {
                name: 'typeMismatch',
                attribute: 'type',
                isInvalid: () => {
                    let type = $element.getAttr('type');

                    if (type == 'email') return !/[^\s]+@[^\s]+/.test(element.value);
                    if (type == 'number') return /[^0-9]/g.test(element.value);
                    if (type == 'url') return !/(http|ftp)s?:\/\//.test(element.value);

                    return false;
                }
            },

            { name: 'customError' },
            { name: 'stepMismatch' }
        ];

        let errors = {};
        if (element.validity !== undefined) {
            apiErrors.forEach(error => {
                if (element.validity[error.name] !== undefined) errors[error.name] = element.validity[error.name];
                else if (typeof error.isInvalid == 'function') errors[error.name] = !$element.hasAttr(error.attribute) ? false : error.isInvalid();
            });
        }

        errors.invalid = !element.checkValidity();
        return errors;
    }

    textContent () {
        return this.elements.length ? this.get(0).textContent : '';
    }

    html (htmlContent) {
        if (typeof htmlContent == 'string') {
            this.each(element => { element.innerHTML = htmlContent; });
            return this;
        }

        return this.get(0).innerHTML;
    }

    tagName () {
        return this.elements.length ? this.get(0).tagName.toLowerCase() : '';
    }

    aria (prop, value) {
        this.setAttr(`aria-${prop}`, value);
        return this;
    }
}

export default (selector, parent) => {
    return new $(selector, parent);
};