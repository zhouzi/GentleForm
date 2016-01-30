require('html5validation')

let uniqueId = 0

function GentleForm (form, onSubmitCallback = function () {}) {
  /**************************************\
    props
  \**************************************/

  const props = {
    onSubmit,
    updateMessages,
    updateIncludes,
    refreshAria,
    isValid: form.checkValidity.bind(form)
  }

  /**************************************\
    functions
  \**************************************/

  function onSubmit (...args) {
    setState(form, 'submitted', true)
    validate(form)
    getFormChildren().forEach(validate)
    onSubmitCallback.apply(props, args)
  }

  function updateMessages () {
    getFormChildren().forEach(updateMessagesFor)
  }

  function setState (target, state, value) {
    const name = target.getAttribute('name')
    const statesForElements = $$(`[data-states-for="${name}"]`)
    const elements = [target].concat(statesForElements)
    const className = `is-${state}`

    if (value) elements.forEach(element => element.classList.add(className))
    else elements.forEach(element => element.classList.remove(className))
  }

  function hasState (element, state) {
    const className = `is-${state}`
    return element.classList.contains(className)
  }

  function $$ (selector) {
    return [].slice.call(form.querySelectorAll(selector))
  }

  function getFormChildren () {
    return $$('input')
      .filter(function (child) {
        const type = child.getAttribute('name')
        const notValidableElements = ['button', 'submit', 'reset', 'file']

        return notValidableElements.indexOf(type) === -1
      })
      .concat($$('textarea, select'))
  }

  function validate (element) {
    if (element.checkValidity()) {
      setState(element, 'valid', true)
      setState(element, 'invalid', false)
    } else {
      setState(element, 'valid', false)
      setState(element, 'invalid', true)
    }

    // show & hide relevant messages
    updateMessagesFor(element)
  }

  function updateMessagesFor (element) {
    const name = element.getAttribute('name')
    const validity = element.validity

    for (let key in validity) {
      // the validityState object's properties are not its own
      // so we must not use the .hasOwnProperty filter

      // the validityState object has a "valid" property
      // that is true when the input is valid and false otherwise
      // it's not really an error-related property so we ignore it
      if (key === 'valid') continue

      // the property is set to true when the condition is not met
      // e.g an empty required field has the valueMissing property set to true
      const isValid = validity[key] === false

      const messages = $$(`[data-errors-for="${name}"] [data-errors-when="${key}"]`)

      messages.forEach(function (message) {
        if (isValid) hide(message)
        else show(message)
      })
    }
  }

  function show (element) {
    element.style.display = ''
    element.removeAttribute('aria-hidden')
  }

  function hide (element) {
    element.style.display = 'none'
    element.setAttribute('aria-hidden', 'true')
  }

  const includesCache = {}

  function updateIncludes () {
    $$('[data-include]').forEach(function (element) {
      const id = element.getAttribute('data-include')
      if (includesCache[id] == null) includesCache[id] = document.getElementById(id).innerHTML
      element.innerHTML = includesCache[id]
    })
  }

  function refreshAria () {
    $$('[required], [aria-required]').forEach(function (element) {
      if (element.hasAttribute('required')) element.setAttribute('aria-required', 'true')
      else element.removeAttribute('aria-required')
    })

    $$('[data-errors-for]').forEach(function (element) {
      element.setAttribute('role', 'alert')
      element.setAttribute('aria-live', 'assertive')
      element.setAttribute('aria-atomic', 'true')

      // we'll need an id for what's following (aria-describedby)
      let id = element.getAttribute('id')

      if (!id) {
        id = 'gentle_' + uniqueId++
        element.setAttribute('id', id)
      }

      const name = element.getAttribute('data-errors-for')
      const targetInput = $$(`[name="${name}"]`)[0]
      const describedby = targetInput.getAttribute('aria-describedby') || ''
      const describers = describedby.split(' ')

      if (describers.indexOf(id) === -1) describers.push(id)
      targetInput.setAttribute('aria-describedby', describers.join(' ').trim())
    })
  }

  /**************************************\
    init
  \**************************************/

  form.addEventListener('submit', onSubmit, false)

  form.addEventListener('change', function (event) {
    const target = event.target

    setState(target, 'changed', true)
    validate(target)
  }, false)

  form.addEventListener('input', function (event) {
    const target = event.target

    if (hasState(target, 'changed') || hasState(form, 'submitted')) validate(target)
  }, false)

  updateIncludes()
  $$('[data-errors-when]').forEach(hide)
  refreshAria()

  return props
}

module.exports = GentleForm
