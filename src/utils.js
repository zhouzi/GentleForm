export default {
    isButton ($element) {
        return $element.prop('tagName') == 'button' || ['button', 'submit'].indexOf($element.attr('type')) > -1;
    }
};
