import $ from './$';
import utils from './utils';

const TEMPLATES = {};

export default class GentleForm {
    constructor (selector, onSubmit) {
        let $form     = this.$form = $(selector);
        this.onSubmit = typeof onSubmit == 'function' ? onSubmit : () => {};

        $form
            .on('change', event => {
                let $target = $(event.target);

                $target.setState('changed', true, $form);
                this.validate($target);
            })
            .on('input', event => {
                let $target = $(event.target);
                if ($target.hasState('changed') || $target.hasState('submitted')) this.validate($target);
            })
            .on('submit', event => {
                $form.setState('submitted', true, $form);

                let formValidity = $form.validity();
                let children     = formValidity.children;
                let data         = {};

                let $child;
                children.forEach(child => {
                    $child = $(child.element);

                    if (utils.isButton($child)) return;

                    $child.setState('submitted', true, $form);
                    this.validate($child);

                    data[$child.attr('name')] = { validity: child.validity, value: $child.val() };
                });

                this.validate($form);
                this.onSubmit(event, formValidity.valid, data);
            })
        ;

        $('[data-include]').each((element) => {
            let $element   = $(element);
            let templateId = $element.attr('data-include');

            if (typeof TEMPLATES[templateId] != 'string') TEMPLATES[templateId] = $(`#${templateId}`).text();

            $element.html($element.html() + TEMPLATES[templateId]);
        });

        $('[data-errors-when]', $form).hide();
    }

    validate ($elements) {
        $elements.each(element => {
            let $element = $(element);
            let validity = $element.validity();

            if (validity.valid) $element.setState('valid', true, this.$form).setState('invalid', false, this.$form);
            else                $element.setState('invalid', true, this.$form).setState('valid', false, this.$form);

            let $errorMessages = $(`[data-errors-for="${$element.attr('name')}"]`, this.$form);
            let $errorMessagesWhen;

            $errorMessages.each(element => {
                for (let key in validity) {
                    if (!validity.hasOwnProperty(key)) continue;

                    $errorMessagesWhen = $(`[data-errors-when="${key}"]`, element);

                    if (validity[key]) $errorMessagesWhen.show();
                    else $errorMessagesWhen.hide();
                }
            });
        });
    }
}
