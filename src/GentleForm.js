import $ from './$';
import utils from './utils';

const TEMPLATES = {};
let globalIds = 0;

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

                    let name = $child.attr('name');
                    if (name in data) return;

                    let value = null;

                    let type = $child.attr('type');
                    if (type) type = type.toLowerCase();

                    if (type == 'radio') {
                        let $radios = $(`[name="${name}]"`, $form);
                        let $element;
                        $radios.each(element => {
                            $element = $(element);
                            if ($element.checked()) value = $element.val();
                        });
                    } else if (type == 'checkbox') {
                        value = $child.checked();
                    } else {
                        value = $child.val();
                    }

                    data[name] = { validity: child.validity, value: value };
                });

                this.validate($form);
                this.onSubmit(event, formValidity.valid, data);
            })
        ;

        $('[data-include]', $form).each((element) => {
            let $element   = $(element);
            let templateId = $element.attr('data-include');

            if (typeof TEMPLATES[templateId] != 'string') TEMPLATES[templateId] = $(`#${templateId}`).text();

            $element.html($element.html() + TEMPLATES[templateId]);
        });

        $('[data-errors-when]', $form).hide();

        this.refreshAria();
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

        return this;
    }

    refreshAria () {
        let $element;
        $('[required], [aria-required]', this.$form).each(element => {
            $element = $(element);

            if ($element.prop('required')) $element.aria('required', true);
            else $element.removeAttr('aria-required');
        });

        $('[data-errors-for]', this.$form).each(element => {
            $element = $(element);

            $element
                .attr('role', 'alert')
                .aria('live', 'assertive')
                .aria('atomic', true)
            ;

            let name = $element.attr('data-errors-for');
            let $relatedInput = $(`[name="${name}"]`, this.$form);

            if ($relatedInput.length()) {
                let id = $element.attr('id');
                if (typeof id != 'string' || !id.length) {
                    id = `gentle_${globalIds++}`;
                    $element.attr('id', id);
                }

                let describedby = $relatedInput.aria('describedby');
                if (typeof describedby != 'string') describedby = '';

                describedby = describedby.split(' ');
                if (describedby.indexOf(id) < 0) describedby.push(id);
                $relatedInput.aria('describedby', describedby.join(' ').trim());
            }
        });

        return this;
    }
}
