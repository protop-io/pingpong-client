const { createPrompt } = require('./lib')

const { openPrompt, closePrompt } = createPrompt({
  'ping': () => openPrompt()
})

process.on('SIGINT', () => {
  closePrompt()
})

openPrompt()
