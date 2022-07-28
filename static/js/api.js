const DEFAULT_STASH_TTL = 3600 // seconds

const callCreateStash = (secret) => {
  const payload = new URLSearchParams()
  payload.set('secret', secret)
  payload.set('expires_at', Math.round(Date.now() / 1e3 + DEFAULT_STASH_TTL))

  return fetch('/api/create-stash', {
    method: 'POST',
    body: payload
  }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to create the stash, please try again')
    }
    return response.text()
  })
}

const callClaimStash = (stashId) => {
  return fetch(`/api/claim-stash/${stashId}`, { method: 'GET' }).then((response) => {
    if (!response.ok) {
      throw new Error('Failed to claim the stash: Maybe it has been already claimed or has expired.')
    }
    return response.text()
  })
}
