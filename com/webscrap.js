export function webscrap(url) {
  return fetch('https://webscrap.now.sh/webscrap', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      url,
    }),
  })
    .then(res => res.json())
    .then(({ status, message }) => {
      if (status === 'Fail') {
        throw Error(message)
      }
      return json
    })
}
