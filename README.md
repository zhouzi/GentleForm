# GentleForm

Validate forms at the right time, using browser's native api.

* [Demo on CodePen](http://codepen.io/Zhouzi/full/QbBzZp/)
* [GitHub Repository](http://github.com/Zhouzi/GentleForm/)
* [Introduction](http://gabinaureche.com/GentleForm)
* [Documentation](https://github.com/Zhouzi/GentleForm/wiki)
* [Tweet!](https://twitter.com/home?status=GentleForm%20-%20Validate%20forms%20at%20the%20right%20time%2C%20using%20browser%27s%20native%20api%20http%3A%2F%2Fcodepen.io%2FZhouzi%2Ffull%2FQbBzZp%2F%20via%20%40zh0uzi)

## Introduction

GentleForm is actually so simple that calling it a library seems awkward.
It's rather a snippet, focused on validating forms thanks to html5 attributes and browser's native api.
In fact, its real purpose is to validate inputs at **the right time**, when it makes sense from an user perspective.

## But what's the right time?

For now, GentleForm assumes the right time to be...

### When the user interacted with the input

This one is pretty obvious: an input should be validated when the user interacted with it, not before.
So when the page loads and the form appears, there's no error messages displayed nor "redish" inputs.

What's trickier to define is what "interacted with" means.

GentleForm considers that the user interacted with an input when he focused it, typed something and un-focused it (blur).
So, considering an email input: the user click in, type his email address and then click away.
If there's an error, this is when the error feedback are displayed.

Why not validating it before, e.g when he's typing?
Real time validation is so damn cool, isn't it?
Maybe it is, but certainly not for users.
It's like saying to someone that he failed even before he's done trying and that is definitely not cool.

## Form submission

Still, there's a case where we need to validate inputs, no matter whether the user interacted with them or not: on the form's submission.
The thing is, an user could try to submit an invalid form.
Maybe he just missed some fields, maybe he misunderstood something.
In such case, the reasons of the failure should be crystal clear.
This is why the form's submit event triggers the validation of each of its inputs.

## States

So far we talked about form validation: when we check that things looks like expected.
Along with that, GentleForm also deals with states.
A state is represented by two things: a property applied to elements and a css class.

Name|CSS Class|Description
----|---------|-----------
dirty|gentle-state-dirty|The user typed something.
touched|gentle-state-touched|The input lost focus.
interacted|gentle-state-interacted|The input lost focus after being dirty.
invalid|gentle-state-invalid|The input is invalid.
valid|gentle-state-valid|The input is valid.

For more details, please have a look at the [documentation](https://github.com/Zhouzi/GentleForm/wiki).