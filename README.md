# GentleForm

Validate forms at the right time, using browser's native api.

* [Codepen Demo](http://codepen.io/Zhouzi/full/QbBzZp/)
* [GitHub Repository](http://github.com/Zhouzi/GentleForm/)

## Introduction

GentleForm is actually so simple that calling it a library seems awkward.
It's rather a snippet, focused on validating forms thanks to html5 attributes and browser's native api.
In fact, its real purpose is to validate inputs at **the right time** - when it makes sense from an user perspective.

## But what's the right time?

For now, GentleForm assumes the right time to be...

### When the user interacted with the input

This one is pretty obvious: an input should be validated when the user interacted with it, not before.
It means that, when the page loads and the form appears, there's no error messages displayed nor "redish" inputs.

What's trickier to define is what "interacted with" means.

GentleForm considers that the user interacted with an input when he focused it, typed something and then clicked away (blurred the input).
And this is when the validation happens.
So, considering an email input: the user click in, type his email address and then click away.
If there's an error, this is when the error feedback are displayed.

Why not validating it before, e.g when he's typing?
Real time validation is so damn cool, isn't it?
Maybe it is, but certainly not for users.
It's like saying to someone that he failed even before he's done trying and that's definitely not cool.

*More details coming soon...*