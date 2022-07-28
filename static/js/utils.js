const disableButton = (el, className) => {
  const onclick = el.onclick
  el.onclick = null
  el.classList.add(className)

  return () => {
    el.onclick = onclick
    el.classList.remove(className)
  }
}
const disableInput = (el) => {
  el.disabled = true

  return () => {
    el.disabled = false
  }
}
