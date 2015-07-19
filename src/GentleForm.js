import $ from './$';
import isFormInput from './isFormInput';

export default class GentleForm {
    constructor (selector, onSubmit) {
        let self = this;
        self.$form = new $(selector);
        self.onSubmit = typeof onSubmit == 'function' ? onSubmit : () => {};

        self.$form
            .on('blur', event => {
                var $target = new $(event.target);

                if (!isFormInput($target)) return;

                var isDirty = $target.getState('dirty');

                $target.concat(self.$form).setState('touched', true);

                if (isDirty) $target.setState('interacted', true);

                self.validate($target);
            })
            .on('input', event => {
                var $target = new $(event.target);
                $target.concat(self.$form).setState('dirty', true);

                self.validate($target);
            })
            .on('submit', event => {
                event.preventDefault();

                self.$form.setState('submitted', true);

                let data = {};
                for (let i = 0, form = self.$form.get(0), len = form.length, $e, name; i < len; i++) {
                    $e = new $(form[i]);

                    if (!isFormInput($e)) continue;

                    $e.setState('submitted', true);
                    self.validate($e);

                    name = $e.getAttr('name');
                    data[name] = { errors: $e.getErrors(), value: $e.getValue() };
                }

                self.validate(self.$form);
                self.onSubmit(event, self.$form.isValid(), data);
            })
        ;

        $('[data-gentle-error-when]', self.$form).hide();
    }

    validate ($elements) {
        $elements.each(element => {
            let $element = new $(element);

            if (!$element.getState('interacted') && !$element.getState('submitted')) return;

            if ($element.isValid()) $element.setState('invalid', false);
            else $element.setState('invalid', true);

            var errors = $element.getErrors();
            var $errorMessages = new $(`[data-gentle-errors-for="${$element.getAttr('name')}"]`, this.$form);
            let $children;

            $errorMessages.each(element => {
                for (let errorKey in errors) {
                    if (!errors.hasOwnProperty(errorKey)) continue;
                    $children = new $(`[data-gentle-error-when="${errorKey}"`, element);

                    if (errors[errorKey]) $children.show();
                    else $children.hide();
                }
            });
        });
    }
}