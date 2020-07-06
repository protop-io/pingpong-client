const readline = require('readline')
const { say } = require('cowsay')
const indent = require('indent')

const createPrompt = (responseCallbacks) => {
  const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
  })

  rl.on('line', input => {
    responseCallbacks[input] && responseCallbacks[input]()
  })

  return { 
    prompt: () => rl.prompt(true),
    close: rl.removeAllListeners
  }
}

const cowsay = (message) => console.log(indent(say({ text: `${message}` }), 8))

module.exports = {
  createPrompt,
  cowsay
}
