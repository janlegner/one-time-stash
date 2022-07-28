const toasterRoot = () => document.querySelector('.toaster')
const TOASTER_TTL = 7 // seconds
const TOASTER_EXPIRE_ANIMATION_DURATION = 0.5 // seconds

const toaster = (text, style) => {
  const el = document.createElement('div')
  el.innerText = text
  el.classList.add(style)
  toasterRoot().appendChild(el)
  setTimeout(() => expireToaster(el), TOASTER_TTL * 1e3)
}

const expireToaster = (el) => {
  el.classList.add('expired')
  setTimeout(() => toasterRoot().removeChild(el), TOASTER_EXPIRE_ANIMATION_DURATION * 1e3)
}

const toasterSuccess = (text) => toaster(text, 'green')
const toasterError = (text) => toaster(text, 'red')
