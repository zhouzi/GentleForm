export default ($element) => {
    return $element.get(0).tagName != 'button' && ['button', 'submit'].indexOf($element.getAttr('type')) < 0;
};