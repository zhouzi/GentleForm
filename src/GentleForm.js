import $ from './$';
import isButton from './isButton';

const TEMPLATES = {};

export default class GentleForm {
    constructor (selector, onSubmit) {
        let $form     = this.$form = $(selector);
        this.onSubmit = typeof onSubmit == 'function' ? onSubmit : () => {};

        $form
            .on('change', event => {
                let $target = $(event.target);
                let type    = $target.attr('type');

                // We need to first make sure that the target is an input of type checkbox or radio.
                if ($target.prop('tagName') != 'input' ||
                    ['checkbox', 'radio'].indexOf(type) < 0) return;

                $target.add(this.$form).setState('dirty', true, this.$form);
                this.validate($target);
            })
            .on('blur', event => {
                let $target = $(event.target);

                if (isButton($target)) return;

                let isDirty = $target.getState('dirty');

                $target.add(this.$form).setState('touched', true, this.$form);

                if (isDirty) $target.setState('interacted', true, this.$form);

                this.validate($target);
            })
            .on('input', event => {
                let $target = $(event.target);

                $target.add(this.$form).setState('dirty', true, this.$form);
                this.validate($target);
            })
            .on('submit', event => {
                this.$form.setState('submitted', true, this.$form);

                let formValidity = this.$form.validity();
                let children     = formValidity.children;
                let data         = {};

                let $child;
                children.forEach(child => {
                    $child = $(child.element);

                    $child.setState('submitted', true, this.$form);
                    this.validate($child);

                    data[$child.attr('name')] = { validity: child.validity, value: $child.val() };
                });

                this.validate(this.$form, true);
                this.onSubmit(event, formValidity.valid, data);
            })
        ;

        $('[data-gentle-include]').each((element) => {
            let $element   = $(element);
            let templateId = $element.attr('data-gentle-include');

            if (typeof TEMPLATES[templateId] != 'string') TEMPLATES[templateId] = $(`#${templateId}`).text();

            $element.html($element.html() + TEMPLATES[templateId]);
        });

        $('[data-gentle-errors-when]', this.$form).hide();
    }

    validate ($elements, validateForm = false) {
        $elements.each(element => {
            let $element = $(element);
            let tag      = $element.prop('tagName');

            // Can't validate a form that is not submitted (see below).
            if (tag == 'form' && !$element.getState('submitted')) return;

            // An element needs to be whether interacted or submitted to be validated.
            if (!$element.getState('interacted') && !$element.getState('submitted')) return;

            if ($element.checkValidity()) {
                $element
                    .setState('invalid', false, this.$form)
                    .setState('valid', true, this.$form)
                ;
            } else if (tag != 'form' || validateForm) {
                // By default, a form's state is not updated if invalid.
                // This behavior is overwritten by the "validateForm" parameter which is passed as true on form submission.
                // The fact is, we do not want to display global errors (related the form element) before submission.
                $element
                    .setState('invalid', true, this.$form)
                    .setState('valid', false, this.$form)
                ;
            }

            let errors         = $element.getErrors(); // getErrors makes the validity object clearer.
            let $errorMessages = $(`[data-gentle-errors-for="${$element.attr('name')}"]`, this.$form);
            let $children;

            $errorMessages.each(element => {
                for (let errorKey in errors) {
                    if (!errors.hasOwnProperty(errorKey)) continue;

                    $children = $(`[data-gentle-errors-when="${errorKey}"]`, element);

                    if (errors[errorKey]) {
                        // Once again, do not show global error messages (apart on form submission).
                        if (tag != 'form' || validateForm) $children.show();
                    } else {
                        $children.hide();
                    }
                }
            });
        });
    }
}
