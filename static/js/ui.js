const getSecretInputElement = () => document.querySelector('#secret-input')
const getStashLinkElement = () => document.querySelector('#stash-link')
const getClaimedStashElement = () => document.querySelector('#claimed-stash')
const getCreateStashButton = () => document.querySelector('#create-stash-button')
const getClaimStashButton = () => document.querySelector('#claim-stash-button')

const getStashIdFromUrl = () => {
  const urlParams = new URLSearchParams(window.location.search)
  const [urlParamKey] = urlParams.keys()
  return urlParamKey ?? null
}

window.ui = {
  start: () => {
    if (getStashIdFromUrl()) {
      ui.showStep('claim-1')
    } else {
      ui.showStep('stash-1')
    }
  },
  createStash: () => {
    const secret = getSecretInputElement().value
    const enableButton = disableButton(getCreateStashButton(), 'disabled')
    const enableInput = disableInput(getSecretInputElement())

    callCreateStash(secret).then((stashId) => {
      getStashLinkElement().innerText = `${window.location.href.replace(/\?.*/, '')}?${stashId}`
      ui.showStep('stash-3')
    }).catch((err) => {
      toasterError(err.message)
    }).finally(() => {
      enableButton()
      enableInput()
    })
  },
  claimStash: () => {
    const stashId = getStashIdFromUrl()
    const enableButton = disableButton(getClaimStashButton(), 'disabled')

    callClaimStash(stashId).then((secret) => {
      getClaimedStashElement().innerText = secret
      ui.hideStep('claim-1')
      ui.showStep('claim-2')
      toasterSuccess('Stash successfully claimed')
    }).catch((err) => {
      toasterError(err.message)
    }).finally(() => {
      enableButton()
    })
  },
  copyToClipboard: (selector) => {
    const link = document.querySelector(selector).innerText
    navigator.clipboard.writeText(link)
    toasterSuccess('Copied to clipboard')
  },
  onSecretInput: (element) => {
    if (element.value === '') {
      ui.hideStep('stash-2')
      ui.hideStep('stash-3')
    } else {
      ui.showStep('stash-2')
      ui.hideStep('stash-3')
    }
  },
  showStep: (step) => {
    [].forEach.call(document.querySelectorAll(`[data-step='${step}']`), (element) => {
      element.classList.remove('hidden-step')
    })
  },
  hideStep: (step) => {
    [].forEach.call(document.querySelectorAll(`[data-step='${step}']`), (element) => {
      element.classList.add('hidden-step')
    })
  },
}
