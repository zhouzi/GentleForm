import $ from './$';
import isFormInput from './isFormInput';

export default class GentleForm {
    constructor (selector, onSubmit) {
        let self = this;
        self.$form = $(selector);
        self.onSubmit = typeof onSubmit == 'function' ? onSubmit : () => {};

        self.$form
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
                    $children = $(`[data-gentle-errors-when="${errorKey}"`, element);

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