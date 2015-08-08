import $ from    '../bower_components/flooz/src/flooz';
import core from '../bower_components/flooz/src/core';
import           '../bower_components/flooz/src/events';
import           '../bower_components/flooz/src/class';
import           '../bower_components/flooz/src/html';
import           '../bower_components/flooz/src/attributes';
import           '../bower_components/flooz/src/checked';
import           '../bower_components/flooz/src/validity';
import           '../bower_components/flooz/src/value';
import           '../bower_components/flooz/src/aria';
import           '../bower_components/flooz/src/text';

core.fn.show = function () {
    this
        .aria('hidden', false)
        .removeClass('gentle-hide')
    ;

    return this;
};

core.fn.hide = function () {
    this
        .aria('hidden', true)
        .addClass('gentle-hide')
    ;

    return this;
};

core.fn.setState = function (stateName, stateValue, parentForm = document) {
    if (stateValue === undefined) throw('No stateValue passed to $.setState()');

    this.each(element => {
        if (!element.gentleState) element.gentleState = {};
        element.gentleState[stateName] = stateValue;
    });

    let className = 'gentle-state-' + stateName;
    let $reflectors = new $(`[data-gentle-state-for="${this.attr('name')}"]`, parentForm);

    if (stateName == 'invalid') this.aria('invalid', stateValue);

    if (stateValue) {
        this.addClass(className);
        $reflectors.addClass(className);
    } else {
        this.removeClass(className);
        $reflectors.removeClass(className);
    }

    return this;
};

core.fn.getState = function (stateName) {
    let element = this.get(0);
    return element.gentleState ? element.gentleState[stateName] : null;
};

core.fn.getErrors = function () {
    let validity = this.validity();
    let errors   = { invalid: !validity.valid };

    for (var key in validity) {
        if (!validity.hasOwnProperty(key) || key == 'valid') continue;
        errors[key] = validity[key];
    }
    return errors;
};

export default $;
