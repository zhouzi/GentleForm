# GentleForm

Accessible and user-friendly HTML5 form validation library.

* [Demo on CodePen](http://codepen.io/Zhouzi/full/QbBzZp/)
* [Features](https://github.com/Zhouzi/GentleForm#features)
* [Usage](https://github.com/Zhouzi/GentleForm#usage)
* [Documentation](https://github.com/Zhouzi/GentleForm#documentation)
    * [Instantiation And Form Submission](https://github.com/Zhouzi/GentleForm#instantiation-and-form-submission)
    * [CSS Classes](https://github.com/Zhouzi/GentleForm#css-classes)
    * [Error Messages](https://github.com/Zhouzi/GentleForm#error-messages)
    * [Reusing Messages](https://github.com/Zhouzi/GentleForm#reusing-messages)
    * [ARIA Support](https://github.com/Zhouzi/GentleForm#aria-support)
    * [API](https://github.com/Zhouzi/GentleForm#api)

## Features

* Lightweight, no dependencies.
* Based on the [HTML5 Constraint Validation](https://developer.mozilla.org/en-US/docs/Web/Guide/HTML/HTML5/Constraint_validation) api.
* Display error messages and validate inputs when it makes sense from an user perspective.
* Improve forms' accessibility by adding the relevant aria attributes.
* Prevent code duplication by reusing feedback messages.

## Usage

1. Get GentleForm
    * direct download: [GentleForm.js](https://raw.githubusercontent.com/Zhouzi/GentleForm/gh-pages/dist/GentleForm.js)
    * via bower: `bower install gentleform`
2. Include it: `<script src="path/to/GentleForm.js"></script>`
3. Add the desired styles (see basic example below)
4. Create a new GentleForm object (see basic example below)

**Basic example:**

```html
<style>
    .is-invalid { border-color: red; }
    .is-valid { border-color: green; }
</style>

<form id="example-form">
    <input type="text" name="firstname" required>

    <div data-errors-for="firstname">
        <div data-errors-when="valueMissing">This field is required.</div>
    </div>

    <button type="submit">Submit</button>
</form>

<script src="GentleForm.js"></script>
<script>
  GentleForm(document.getElementById('example-form'), function onSubmit (event) {
    if (this.isValid()) {
      // do something when form is valid
    } else {
      // do something when form is invalid
    }
  });
</script>
```

## Documentation

* [Instantiation And Form Submission](https://github.com/Zhouzi/GentleForm#instantiation-and-form-submission)
* [CSS Classes](https://github.com/Zhouzi/GentleForm#css-classes)
* [Error Messages](https://github.com/Zhouzi/GentleForm#error-messages)
* [Reusing Messages](https://github.com/Zhouzi/GentleForm#reusing-messages)
* [ARIA Support](https://github.com/Zhouzi/GentleForm#aria-support)

### Instantiation And Form Submission

```html
<form>
    <input type="text" name="firstname" required>
    <div data-errors-for="firstname">
        <div data-errors-when="valueMissing">This field is required.</div>
    </div>
</form>

<script src="path/to/GentleForm.min.js"></script>
<script>GentleForm(document.querySelector('form'), function (event) {});</script>
```

The first argument passed to GentleForm is a form element.
The second one is a function to call on form submission.
The callback receives the submit event and its context is bound to the GentleForm object.

### CSS Classes

Name         | Description
-------------|---------------------------------------------------------------------------
is-changed   | Added when the input's value [change](https://developer.mozilla.org/en-US/docs/Web/Events/change)'d, meaning the user interacted with it.
is-submitted | Added when the input has been submitted.
is-valid     | Added when the input is valid.
is-invalid   | Added when the input is invalid.

Note: the inputs are validated in real time but only after the "is-changed" and/or "is-submitted" classes has been added.
It means that an input won't have the class "is-valid" nor "is-invalid" until the user interact with it.*

Those classes are added to the form elements their selves.
If you want to add them to an other element, you can use the "data-states-for" attribute.

```html
<input type="text" name="firstname">
<div data-states-for="firstname"></div>
```

So now, every classes that are added to the firstname's input will be added to the div too.

### Error Messages

```html
<input type="text" name="firstname" required>
<div data-errors-for="firstname">
    <div data-errors-when="valueMissing">This field is required.</div>
</div>
```

As you can see, the `data-errors-for` attribute acts a bit like a switch statement.
The first thing is to declare what input it is related to by referencing it via its name (e.g `data-errors-for="firstname"`).
Then, within this element, you can add error messages to display when one of the form element's [validityState](https://developer.mozilla.org/fr/docs/Web/API/ValidityState) object property is set to true (e.g `data-errors-when="valueMissing"`).
Here is the supported constraints:

* `patternMismatch` indicates if the value does not match the specified pattern (e.g `<input pattern="[a-z]">`).
* `rangeOverflow` indicates if the value is greater than the maximum specified by the max attribute (e.g `<input max="5">`).
* `rangeUnderflow` indicates if the value is less than the minimum specified by the min attribute (e.g `<input min="5">`).
* `stepMismatch` indicates if the value does not fit the rules determined by the step attribute (that is, it's not evenly divisible by the step value).
* `tooLong` indicates if the value exceeds the specified maxlength for HTMLInputElement or HTMLTextAreaElement objects (e.g `<input maxlength="5">`).
* `typeMismatch` indicates if the value is not in the required syntax (when type is email or url).
* `valid ` indicates if the element meets all constraint validations, and is therefore considered to be valid.
* `valueMissing ` indicates if the element has a required attribute, but no value (e.g `<input required>`).

GentleForm is distributed with an [html5validation](https://github.com/Zhouzi/html5validation) shim to bring support for the HTML5 validation api in older browsers.

### Reusing Messages

To avoid duplicating the same error messages for every form elements, you can use the `data-include` attribute.

```html
<input type="text" name="firstname" required>
<div data-errors-for="firstname" data-include="form-errors"></div>

<input type="text" name="lastname" required>
<div data-errors-for="lastname" data-include="form-errors"></div>

<script type="text/gentle-template">
    <div data-errors-when="valueMissing">This field is required.</div>
</script>
```

### ARIA Support

Those attributes are updated live:

* `aria-hidden`: added and set to true along with the `is-hidden` class.
* `aria-invalid`: added and set to true to invalid elements.

While those ones are added on GentleForm's instantiation:

* `aria-required`: added and set to true to required inputs.
* `role=alert live=assertive atomic=true`: added to error messages (`[data-errors-for]`).
* `aria-describedby`: added to inputs that have related error messages (support multiple references).

There's nothing you need to do for the aria attributes to be added as long as you do not manipulate the form's DOM content.
Otherwise, if you need to add/remove form elements or change a required attribute you can call `.refreshAria()`.
Here is an example of how you could do that:

```html
<form>
    <input type="text" required>
</form>

<script>
    var form = GentleForm(document.querySelector('form'));

    setTimeout(function () {
        document.querySelector('form').innerHTML += '<input type="email" required>';
        form.refreshAria();
    }, 1000);
</script>
```

### API

* **updateMessages** - Display relevant feedback messages.
* **updateIncludes** - Compile `data-include`s.
* **refreshAria** - Update aria attributes.
* **isValid** - Returns true if form is valid and false otherwise.
