# GentleForm

## TODO

* [ ] Since the form is validated anytime an input or blur event is fired, its `data-gentle-errors` are showed. We would like to display it only when the form is submitted so maybe we should add a special case for the form or play around with the classes added by the `data-gentle-state-for`. Another solution would be to make the display strategy configurable (e.g only when submitted).