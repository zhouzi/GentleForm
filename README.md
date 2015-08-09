# GentleForm

Form validation, the right way.

* [Demo on CodePen](http://codepen.io/Zhouzi/full/QbBzZp/)
* [Features](https://github.com/Zhouzi/GentleForm#features)
* [Usage](https://github.com/Zhouzi/GentleForm#usage)
* [Documentation](https://github.com/Zhouzi/GentleForm#documentation)

## Features

* Lightweight, no dependencies.
* Based on the HTML5 form validation api (with polyfills).
* Display error messages and validate inputs when it makes sense from an user perspective.
* Improve forms' accessibility by adding the relevant aria attributes.
* Supports "cached" templates to avoid duplicating error messages.

## Usage

1. Download GentleForm
    * From the repo: [GentleForm.min.js](https://raw.githubusercontent.com/Zhouzi/GentleForm/gh-pages/dist/GentleForm.min.js)
2. Include it: `<script src="path/to/GentleForm.min.js"></script>`
3. Add the required styles: `.is-hidden { display: none !important; }`

**Basic example:**

```html
<style>
    .is-hidden { display: none !important; }
    .is-invalid { border-color: red; }
    .is-valid { border-color: green; }
</style>

<form>
    <input type="text" name="firstname" required>

    <div data-errors-for="firstname">
        <div data-errors-when="valueMissing">This field is required.</div>
    </div>

    <button type="submit">Submit</button>
</form>

<script src="GentleForm.min.js"></script>
<script>new GentleForm('form', function onSubmit (event, isValid, data) {});</script>
```

## Documentation

* [Instantiation And Form Submission](https://github.com/Zhouzi/GentleForm#instantiation-and-form-submission)
* [CSS Classes](https://github.com/Zhouzi/GentleForm#css-classes)
* [Error Messages](https://github.com/Zhouzi/GentleForm#error-messages)
* [Caching Templates](https://github.com/Zhouzi/GentleForm#caching-templates)
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
<script>new GentleForm('form', function (event, isValid, data) {});</script>
```

The first argument passed to GentleForm is a css selector targetting a form.
The second one is a function to call on form submission.
The callback receives three arguments:

1. `event` - the submit event.
2. `isValid` - a boolean indicating if the form is valid or not.
3. `data` - an object containing the form's data.

So given the example above, considering that the firstname input has been filled with "joe", the data object would look like:

```javascript
{
    "firstname": {
        "value": "joe",
        "validity": {
            "valid": false,
            "customError": false,
            "patternMismatch": false,
            "rangeOverflow": false,
            "rangeUnderflow": false,
            "stepMismatch": false,
            "tooLong": false,
            "tooShort": false,
            "typeMismatch": false,
            "valueMissing": false
        }
    }
}
```

### CSS Classes

Name         | Description
-------------|---------------------------------------------------------------------------
is-hidden    | Used to hide error messages.
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
You first need to declare what input it is related.
Then you can add messages for each of the form element's [validityState](https://developer.mozilla.org/fr/docs/Web/API/ValidityState) properties, listed below.

* `badInput` indicates if the user has provided input that the browser is unable to convert.
* `customError` indicates if the element's custom validity message has been set to a non-empty string by calling the element's `setCustomValidity()` method.
* `patternMismatch` indicates if the value does not match the specified pattern (e.g `<input pattern="[a-z]">`).
* `rangeOverflow` indicates if the value is greater than the maximum specified by the max attribute (e.g `<input max="5">`).
* `rangeUnderflow` indicates if the value is less than the minimum specified by the min attribute (e.g `<input min="5">`).
* `stepMismatch` indicates if the value does not fit the rules determined by the step attribute (that is, it's not evenly divisible by the step value).
* `tooLong` indicates if the value exceeds the specified maxlength for HTMLInputElement or HTMLTextAreaElement objects (e.g `<input maxlength="5">`).
* `tooShort` indicates if the value exceeds the specified minlength for HTMLInputElement or HTMLTextAreaElement objects (e.g `<input minlength="5">`).
* `typeMismatch` indicates if the value is not in the required syntax (when type is email or url).
* `valid ` indicates if the element meets all constraint validations, and is therefore considered to be valid.
* `valueMissing ` indicates if the element has a required attribute, but no value (e.g `<input required>`).

The `validityState` object and `checkValidity()` method are not fully supported, even by modern browsers.
To ensure a consistent behavior, GentleForm internally uses [flooz](https://github.com/Zhouzi/flooz) which has "polyfills" for those features.

### Caching Templates

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

It means that you'll probably want to refresh aria attributes when adding/removing elements or changing an input's required attribute.
Here is an example of how you could do that:

```html
<form>
    <input type="text" required>
</form>

<script>
    var form = new GentleForm('form');

    setTimeout(function () {
        document.querySelector('form').innerHTML += '<input type="email" required>';
        form.refreshAria();
    }, 1000);
</script>
```
