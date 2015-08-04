import $ from './$';
import isFormInput from './isFormInput';

const TEMPLATES = {};

export default class GentleForm {
    constructor (selector, onSubmit) {
        let self = this;

        self.$form = $(selector);
        self.onSubmit = typeof onSubmit == 'function' ? onSubmit : () => {};

        self.$form
            .on('focus, mouseup', event => {
                // the input event doesn't trigger for checkbox and radio (while it does for selects)
                // we need to listen to the focus event to support labels that are bound to inputs (e.g clicking the label checks the box)
                let $target = $(event.target);

                if ($target.tagName() != 'input' || ['checkbox', 'radio'].indexOf($target.getAttr('type')) < 0) return;

                // the event is triggered before the input's value changes so the validity object says it's invalid at this point
                // setting a timeout lets some room to the validity object to update
                setTimeout(() => {
                    if ($target.getAttr('type') == 'radio') {
                        $(`[name="${$target.getAttr('name')}"]`).each(function (element) {
                            $(element, self.$form).aria('checked', element.checked)
                        });
                    } else {
                        $target.aria('checked', $target.get(0).checked);
                    }

                    $target.concat(self.$form).setState('dirty', true, self.$form);
                    self.validate($target);
                }, 0);
            })
            .on('blur', event => {
                let $target = $(event.target);

                if (!isFormInput($target)) return;

                let isDirty = $target.getState('dirty');

                $target.concat(self.$form).setState('touched', true, self.$form);

                if (isDirty) $target.setState('interacted', true, self.$form);

                self.validate($target);
            })
            .on('input', event => {
                let $target = $(event.target);
                $target.concat(self.$form).setState('dirty', true, self.$form);

                self.validate($target);
            })
            .on('submit', event => {
                self.$form.setState('submitted', true, self.$form);

                let data = {};
                for (let i = 0, form = self.$form.get(0), len = form.length, $e, name; i < len; i++) {
                    $e = $(form[i]);

                    if (!isFormInput($e)) continue;

                    $e.setState('submitted', true, self.$form);
                    self.validate($e);

                    name = $e.getAttr('name');
                    data[name] = { errors: $e.getErrors(), value: $e.getValue() };
                }

                self.validate(self.$form, true);
                self.onSubmit(event, self.$form.isValid(), data);
            })
        ;

        $('[data-gentle-include]').each(function (element) {
            var $element = $(element);
            var id = $element.getAttr('data-gentle-include');

            if (typeof TEMPLATES[id] != 'string') TEMPLATES[id] = $(`#${id}`).textContent();

            $element.html($element.html() + TEMPLATES[id]);
        });

        $('[data-gentle-errors-when]', self.$form).hide();
    }

    validate ($elements, validateForm = false) {
        let self = this;

        $elements.each(element => {
            let $element = $(element);
            let tag = $element.get(0).tagName.toLowerCase();

            if (tag == 'form' && !$element.getState('submitted')) return;
            if (!$element.getState('interacted') && !$element.getState('submitted')) return;

            if ($element.isValid()) $element.setState('invalid', false, self.$form).setState('valid', true, self.$form);
            else if (tag != 'form' || validateForm) $element.setState('invalid', true, self.$form).setState('valid', false, self.$form);

            let errors = $element.getErrors();
            let $errorMessages = $(`[data-gentle-errors-for="${$element.getAttr('name')}"]`, this.$form);
            let $children;

            $errorMessages.each(element => {
                for (let errorKey in errors) {
                    if (!errors.hasOwnProperty(errorKey)) continue;
                    $children = $(`[data-gentle-errors-when="${errorKey}"]`, element);

                    if (errors[errorKey]) {
                        if (tag != 'form' || validateForm) $children.show();
                    } else {
                        $children.hide();
                    }
                }
            });
        });
    }
}