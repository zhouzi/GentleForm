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

                $target.concat(self.$form).setState('touched', true);

                if (isDirty) $target.setState('interacted', true);

                self.validate($target);
            })
            .on('input', event => {
                let $target = $(event.target);
                $target.concat(self.$form).setState('dirty', true);

                self.validate($target);
            })
            .on('submit', event => {
                event.preventDefault();

                self.$form.setState('submitted', true);

                let data = {};
                for (let i = 0, form = self.$form.get(0), len = form.length, $e, name; i < len; i++) {
                    $e = $(form[i]);

                    if (!isFormInput($e)) continue;

                    $e.setState('submitted', true);
                    self.validate($e);

                    name = $e.getAttr('name');
                    data[name] = { errors: $e.getErrors(), value: $e.getValue() };
                }

                self.validate(self.$form, true);
                self.onSubmit(event, self.$form.isValid(), data);
            })
        ;

        $('[data-gentle-error-when]', self.$form).hide();
    }

    validate ($elements, validateForm = false) {
        $elements.each(element => {
            let $element = $(element);
            let tag = $element.get(0).tagName.toLowerCase();

            if (tag == 'form' && !$element.getState('submitted')) return;
            if (!$element.getState('interacted') && !$element.getState('submitted')) return;

            if ($element.isValid()) $element.setState('invalid', false);
            else if (tag != 'form' || validateForm) $element.setState('invalid', true);

            let errors = $element.getErrors();
            let $errorMessages = $(`[data-gentle-errors-for="${$element.getAttr('name')}"]`, this.$form);
            let $children;

            $errorMessages.each(element => {
                for (let errorKey in errors) {
                    if (!errors.hasOwnProperty(errorKey)) continue;
                    $children = $(`[data-gentle-error-when="${errorKey}"`, element);

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