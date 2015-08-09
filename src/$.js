import $    from '../bower_components/flooz/src/flooz';
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

core.fn.setState = function (stateName, stateValue, container) {
    if ((stateName == 'invalid' && stateValue === true) || (stateName == 'valid' && stateValue === false)) this.aria('invalid', true);
    else if ((stateName == 'invalid' && stateValue === false) || (stateName == 'valid' && stateValue === true)) this.aria('invalid', false);

    let className = `is-${stateName}`;
    let $targets  = new $(`[data-states-for="${this.attr('name')}"]`, container).add(this.get());

    if (stateValue) $targets.addClass(className);
    else $targets.removeClass(className);

    return this;
};

core.fn.hasState = function (stateName) {
    return this.hasClass(`is-${stateName}`);
};

core.fn.show = function () { return this.aria('hidden', false).removeClass('is-hidden'); };
core.fn.hide = function () { return this.aria('hidden', true).addClass('is-hidden'); };

export default $;
