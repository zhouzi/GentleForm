# GentleForm

Validate forms at the right time, using browser's native api.

* [Demo on CodePen](http://codepen.io/Zhouzi/full/QbBzZp/)
* [Introduction](http://gabinaureche.com/javascript/form/ux/2015/07/25/validate-forms-at-the-right-time-using-browser-native-api/)
* [Usage](https://github.com/Zhouzi/GentleForm#usage)
* [Documentation](https://github.com/Zhouzi/GentleForm#documentation)

Note: GentleForm is a lightweight library without any dependencies. That been said, its design is largely inspired by [Angular](https://angularjs.org/)'s [formController](https://docs.angularjs.org/api/ng/type/form.FormController) and [ngMessages](https://docs.angularjs.org/api/ngMessages/directive/ngMessages).

## Usage

1. [Download GentleForm](https://raw.githubusercontent.com/Zhouzi/GentleForm/gh-pages/dist/GentleForm.min.js)
2. Include it: `<script src="path/to/GentleForm.min.js"></script>`
3. Add the required styles: `.gentle-hide { display: none !important; }`
4. You are now able to create a new instance: `new GentleForm('form', function onSubmit (event, isValid, data) {})`

GentleForm accepts two arguments: the first one is a selector string or a DOM element, the second one is a function to call on form submission.

**Basic example:**

```html
<style>
    .gentle-hide { display: none !important; }
    .gentle-state-invalid { border-color: red; }
    .gentle-state-valid { border-color: green; }
</style>

<form>
    <input type="text" name="firstname" required>

    <div data-gentle-errors-for="firstname">
        <div data-gentle-errors-when="valueMissing">This field is required.</div>
    </div>

    <button type="submit">Submit</button>
</form>

<script src="GentleForm.min.js"></script>
<script>
    new GentleForm('form', function onSubmit (event, isValid, data) {});
</script>
```

*Note: GentleForm references inputs by their name.*

## Documentation

* [States And Styles](https://github.com/Zhouzi/GentleForm#states-and-styles)
* [HTML Attributes](https://github.com/Zhouzi/GentleForm#html-attributes)
* [Handling Submission](https://github.com/Zhouzi/GentleForm#handling-submission)

### States And Styles

To validate inputs, display error messages and for styling reasons, GentleForm deals with "states".
A state is actually a name that represent the status of an input.
When modifying an element's state, GentleForm also add or remove the related css class.

State Name|CSS Class|Description
----------|---------|-----------
dirty|`gentle-state-dirty`|The user typed something in the input.
touched|`gentle-state-touched`|The element lost focus.
interacted|`gentle-state-interacted`|The element lost focus after being dirty.
submitted|`gentle-state-submitted`|The element has been submitted.
invalid|`gentle-state-invalid`|The element is invalid.
valid|`gentle-state-valid`|The element is valid.

A dirty, touched and interacted input looks like:

```html
<input type="text" name="name" class="gentle-state-dirty gentle-state-touched gentle-state-interacted">
```

Those states and css classes makes it easy to style invalid and valid inputs:

```html
<style>
    .gentle-state-invalid { border-color: red; }
    .gentle-state-valid { border-color: green; }
</style>
```

### HTML Attributes

#### `data-gentle-states-for`

There's some cases where you'll want to add an input's state classes to an other element.
The demo is a good example: when an input is invalid, its whole container is styled and not just the input itself.

```html
<!--
    Below is an example of adding a "reflector".
    When validating "firstname", the relevant css classes will be added to the div too.
-->

<div data-gentle-states-for="firstname" class="gentle-state-touched">
    <input type="text" name="firstname" class="gentle-state-touched">
</div>
```

#### `data-gentle-errors-for`

Error messages are grouped within a container that reference an input by its name.
It actually looks like a "switch" statement.

```html
<input type="email" name="user_email" required>

<div data-gentle-errors-for="user_email">
    <div data-gentle-errors-when="valueMissing">This field is required.</div>
    <div data-gentle-errors-when="typeMismatch">Please enter a valid email address.</div>
</div>
```

Quoting [HTML5Rocks](http://www.html5rocks.com/)' article [Constraint Validation: Native Client Side Validation for Web Forms](http://www.html5rocks.com/en/tutorials/forms/constraintvalidation/), here are the possible values:

* **customError**: true if a custom validity message has been set per a call to setCustomValidity().
* **patternMismatch**: true if the node's value does not match its pattern attribute.
* **rangeOverflow**: true if the node's value is greater than its max attribute.
* **rangeUnderflow**: true if the node's value is less than its min attribute.
* **stepMismatch**: true if the node's value is invalid per its step attribute.
* **tooLong**: true if the node's value exceeds its maxlength attribute.
* **typeMismatch**: true if an input node's value is invalid per its type attribute.
* **valueMissing**: true if the node has a required attribute but has no value.
* **valid**: true if all of the validity conditions listed above are false.

### Handling Submission

The second argument passed to GentleForm's instantiation is a function to execute on form submission.
This function receives three arguments:

1. `event`: The event object.
2. `isValid`: Whether the form is valid or not.
3. `data`: The form's data.

**Example:**

Considering the markup:

```html
<form>
    <input type="text" name="firstname" value="andrew">
    <button type="submit">Submit</button>
</form>

<script src="path/to/GentleForm.min.js"></script>
<script>new GentleForm('form', function (event, isValid, data) {});</script>
```

Submitting the form would bring a data object that looks like:

```javascript
{
    "firstname": {
        "value": "andrew",
        "errors": {
            "invalid": false,
            "customError": false,
            "patternMismatch": false,
            "rangeOverflow": false,
            "rangeUnderflow": false,
            "stepMismatch": false,
            "tooLong": false,
            "typeMismatch": false,
            "valueMissing": false
        }
    }
}
```
