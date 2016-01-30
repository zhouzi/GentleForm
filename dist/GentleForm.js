/*!
 * GentleForm - v2.0.0
 * Accessible and user-friendly HTML5 form validation library.
 * https://github.com/Zhouzi/GentleForm
 *
 * @author Gabin Aureche
 * @license MIT
 */

(function webpackUniversalModuleDefinition(root, factory) {
	if(typeof exports === 'object' && typeof module === 'object')
		module.exports = factory();
	else if(typeof define === 'function' && define.amd)
		define([], factory);
	else if(typeof exports === 'object')
		exports["GentleForm"] = factory();
	else
		root["GentleForm"] = factory();
})(this, function() {
return /******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};

/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {

/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;

/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};

/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;

/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}


/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;

/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;

/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";

/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';

	__webpack_require__(1);

	var uniqueId = 0;

	function GentleForm(form) {
	  var onSubmitCallback = arguments.length <= 1 || arguments[1] === undefined ? function () {} : arguments[1];

	  /**************************************\
	    props
	  \**************************************/

	  var props = {
	    onSubmit: onSubmit,
	    updateMessages: updateMessages,
	    updateIncludes: updateIncludes,
	    refreshAria: refreshAria,
	    isValid: form.checkValidity.bind(form)
	  };

	  /**************************************\
	    functions
	  \**************************************/

	  function onSubmit() {
	    setState(form, 'submitted', true);
	    validate(form);
	    getFormChildren().forEach(validate);

	    for (var _len = arguments.length, args = Array(_len), _key = 0; _key < _len; _key++) {
	      args[_key] = arguments[_key];
	    }

	    onSubmitCallback.apply(props, args);
	  }

	  function updateMessages() {
	    getFormChildren().forEach(updateMessagesFor);
	  }

	  function setState(target, state, value) {
	    var name = target.getAttribute('name');
	    var statesForElements = $$('[data-states-for="' + name + '"]');
	    var elements = [target].concat(statesForElements);
	    var className = 'is-' + state;

	    if (value) elements.forEach(function (element) {
	      return element.classList.add(className);
	    });else elements.forEach(function (element) {
	      return element.classList.remove(className);
	    });
	  }

	  function hasState(element, state) {
	    var className = 'is-' + state;
	    return element.classList.contains(className);
	  }

	  function $$(selector) {
	    return [].slice.call(form.querySelectorAll(selector));
	  }

	  function getFormChildren() {
	    return $$('input').filter(function (child) {
	      var type = child.getAttribute('name');
	      var notValidableElements = ['button', 'submit', 'reset', 'file'];

	      return notValidableElements.indexOf(type) === -1;
	    }).concat($$('textarea, select'));
	  }

	  function validate(element) {
	    if (element.checkValidity()) {
	      element.removeAttribute('aria-invalid');
	      setState(element, 'valid', true);
	      setState(element, 'invalid', false);
	    } else {
	      element.setAttribute('aria-invalid', 'true');
	      setState(element, 'valid', false);
	      setState(element, 'invalid', true);
	    }

	    // show & hide relevant messages
	    updateMessagesFor(element);
	  }

	  function updateMessagesFor(element) {
	    var name = element.getAttribute('name');
	    var validity = element.validity;

	    var _loop = function _loop(key) {
	      // the validityState object's properties are not its own
	      // so we must not use the .hasOwnProperty filter

	      // the validityState object has a "valid" property
	      // that is true when the input is valid and false otherwise
	      // it's not really an error-related property so we ignore it
	      if (key === 'valid') return 'continue';

	      // the property is set to true when the condition is not met
	      // e.g an empty required field has the valueMissing property set to true
	      var isValid = validity[key] === false;

	      var messages = $$('[data-errors-for="' + name + '"] [data-errors-when="' + key + '"]');

	      messages.forEach(function (message) {
	        if (isValid) hide(message);else show(message);
	      });
	    };

	    for (var key in validity) {
	      var _ret = _loop(key);

	      if (_ret === 'continue') continue;
	    }
	  }

	  function show(element) {
	    element.style.display = '';
	    element.removeAttribute('aria-hidden');
	  }

	  function hide(element) {
	    element.style.display = 'none';
	    element.setAttribute('aria-hidden', 'true');
	  }

	  var includesCache = {};

	  function updateIncludes() {
	    $$('[data-include]').forEach(function (element) {
	      var id = element.getAttribute('data-include');
	      if (includesCache[id] == null) includesCache[id] = document.getElementById(id).innerHTML;
	      element.innerHTML = includesCache[id];
	    });
	  }

	  function refreshAria() {
	    $$('[required], [aria-required]').forEach(function (element) {
	      if (element.hasAttribute('required')) element.setAttribute('aria-required', 'true');else element.removeAttribute('aria-required');
	    });

	    $$('[data-errors-for]').forEach(function (element) {
	      element.setAttribute('role', 'alert');
	      element.setAttribute('aria-live', 'assertive');
	      element.setAttribute('aria-atomic', 'true');

	      // we'll need an id for what's following (aria-describedby)
	      var id = element.getAttribute('id');

	      if (!id) {
	        id = 'gentle_' + uniqueId++;
	        element.setAttribute('id', id);
	      }

	      var name = element.getAttribute('data-errors-for');
	      var targetInput = $$('[name="' + name + '"]')[0];
	      var describedby = targetInput.getAttribute('aria-describedby') || '';
	      var describers = describedby.split(' ');

	      if (describers.indexOf(id) === -1) describers.push(id);
	      targetInput.setAttribute('aria-describedby', describers.join(' ').trim());
	    });
	  }

	  /**************************************\
	    init
	  \**************************************/

	  form.addEventListener('submit', onSubmit, false);

	  form.addEventListener('change', function (event) {
	    var target = event.target;

	    setState(target, 'changed', true);
	    validate(target);
	  }, false);

	  form.addEventListener('input', function (event) {
	    var target = event.target;

	    if (hasState(target, 'changed') || hasState(form, 'submitted')) validate(target);
	  }, false);

	  updateIncludes();
	  $$('[data-errors-when]').forEach(hide);
	  refreshAria();

	  return props;
	}

	module.exports = GentleForm;

/***/ },
/* 1 */
/***/ function(module, exports) {

	'use strict';

	/******/(function (modules) {
		// webpackBootstrap
		/******/ // The module cache
		/******/var installedModules = {};

		/******/ // The require function
		/******/function __webpack_require__(moduleId) {

			/******/ // Check if module is in cache
			/******/if (installedModules[moduleId])
				/******/return installedModules[moduleId].exports;

			/******/ // Create a new module (and put it into the cache)
			/******/var module = installedModules[moduleId] = {
				/******/exports: {},
				/******/id: moduleId,
				/******/loaded: false
				/******/ };

			/******/ // Execute the module function
			/******/modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);

			/******/ // Flag the module as loaded
			/******/module.loaded = true;

			/******/ // Return the exports of the module
			/******/return module.exports;
			/******/
		}

		/******/ // expose the modules object (__webpack_modules__)
		/******/__webpack_require__.m = modules;

		/******/ // expose the module cache
		/******/__webpack_require__.c = installedModules;

		/******/ // __webpack_public_path__
		/******/__webpack_require__.p = "";

		/******/ // Load entry module and return exports
		/******/return __webpack_require__(0);
		/******/
	})(
	/************************************************************************/
	/******/[
	/* 0 */
	/***/function (module, exports, __webpack_require__) {

		'use strict';

		/* global HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement */

		var routines = {
			customError: __webpack_require__(1),
			badInput: __webpack_require__(2),
			typeMismatch: __webpack_require__(3),
			rangeUnderflow: __webpack_require__(4),
			rangeOverflow: __webpack_require__(5),
			stepMismatch: __webpack_require__(6),
			tooLong: __webpack_require__(7),
			patternMismatch: __webpack_require__(8),
			valueMissing: __webpack_require__(9)
		};[HTMLInputElement, HTMLSelectElement, HTMLTextAreaElement].forEach(function (constructor) {
			if (!('validity' in constructor.prototype)) {
				Object.defineProperty(constructor.prototype, 'validity', {
					get: function get() {
						var validity = { valid: true };

						for (var name in routines) {
							if (!routines.hasOwnProperty(name)) continue;

							validity[name] = routines[name](this);
							if (validity[name] === true) validity.valid = false;
						}

						return validity;
					},

					configurable: true
				});
			}

			if (!('checkValidity' in constructor.prototype)) {
				constructor.prototype.checkValidity = function () {
					var isValid = this.validity.valid;

					if (!isValid) {
						// Old-fashioned way to create events
						// the new way is still not supported by IE
						var event = document.createEvent('Event');
						event.initEvent('invalid', true, true);
						this.dispatchEvent(event);
					}

					return isValid;
				};
			}

			if (!('willValidate' in constructor.prototype)) {
				constructor.prototype.willValidate = true;
			}

			if (!('setCustomValidity' in constructor.prototype)) {
				constructor.prototype.setCustomValidity = function (message) {
					// validationMessage is supposed to be a read-only prop
					// it won't be an issue if it's not implemented but might throw an error otherwise
					try {
						this.validationMessage = message;
					} catch (e) {}
				};
			}
		});

		/***/
	},
	/* 1 */
	/***/function (module, exports) {

		"use strict";

		module.exports = function () {
			return false;
		};

		/***/
	},
	/* 2 */
	/***/function (module, exports) {

		"use strict";

		module.exports = function () {
			return false;
		};

		/***/
	},
	/* 3 */
	/***/function (module, exports) {

		'use strict';

		// http://stackoverflow.com/questions/13289810/javascript-limit-text-field-to-positive-and-negative-numbers

		var numberRegExp = /^-?\d+$/;

		// http://www.whatwg.org/specs/web-apps/current-work/multipage/states-of-the-type-attribute.html#e-mail-state-(type=email)
		var emailRegExp = /^[a-zA-Z0-9.!#$%&'*+\/=?^_`{|}~-]+@[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?(?:\.[a-zA-Z0-9](?:[a-zA-Z0-9-]{0,61}[a-zA-Z0-9])?)*$/;

		// http://regexlib.com/REDetails.aspx?regexp_id=1854
		var urlRegExp = /(http(?:s)?\:\/\/[a-zA-Z0-9\-]+(?:\.[a-zA-Z0-9\-]+)*\.[a-zA-Z]{2,6}(?:\/?|(?:\/[\w\-]+)*)(?:\/?|\/\w+\.[a-zA-Z]{2,4}(?:\?[\w]+\=[\w\-]+)?)?(?:\&[\w]+\=[\w\-]+)*)$/;

		module.exports = function (input) {
			var value = input.value;
			var type = input.getAttribute('type');

			if (type === 'number') return !numberRegExp.test(value);
			if (type === 'url') return !urlRegExp.test(value);
			if (type === 'email') return !emailRegExp.test(value);

			return false;
		};

		/***/
	},
	/* 4 */
	/***/function (module, exports) {

		'use strict';

		module.exports = function (input) {
			if (!input.hasAttribute('min')) return false;
			if (input.getAttribute('type') !== 'number') return false;

			var value = Number(input.value);
			var min = Number(input.getAttribute('min'));

			return value < min;
		};

		/***/
	},
	/* 5 */
	/***/function (module, exports) {

		'use strict';

		module.exports = function (input) {
			if (!input.hasAttribute('max')) return false;
			if (input.getAttribute('type') !== 'number') return false;

			var value = Number(input.value);
			var max = Number(input.getAttribute('max'));

			return value > max;
		};

		/***/
	},
	/* 6 */
	/***/function (module, exports) {

		'use strict';

		module.exports = function (input) {
			if (!input.hasAttribute('step')) return false;

			var type = input.getAttribute('type');
			if (['number', 'range'].indexOf(type) === -1) return false;

			var value = Number(input.value);
			var step = Number(input.getAttribute('step'));

			return value % step !== 0;
		};

		/***/
	},
	/* 7 */
	/***/function (module, exports) {

		'use strict';

		module.exports = function (input) {
			if (!input.hasAttribute('maxlength')) return false;
			if (input.getAttribute('type') === 'number') return false;

			var maxlength = Number(input.getAttribute('maxlength'));

			return input.value.length > maxlength;
		};

		/***/
	},
	/* 8 */
	/***/function (module, exports) {

		'use strict';

		module.exports = function (input) {
			if (!input.hasAttribute('pattern')) return false;

			var pattern = input.getAttribute('pattern');
			var regexp = new RegExp(pattern);

			return regexp.test(input.value) === false;
		};

		/***/
	},
	/* 9 */
	/***/function (module, exports) {

		'use strict';

		module.exports = function (input) {
			if (!input.hasAttribute('required')) return false;

			var type = input.getAttribute('type') || input.tagName.toLowerCase();

			if (type === 'checkbox') return input.checked !== true;
			if (type !== 'radio' && type !== 'range') return input.value.length === 0;

			return false;
		};

		/***/
	}
	/******/]);

/***/ }
/******/ ])
});
;