const grpc = require('@grpc/grpc-js')
const protoLoader = require('@grpc/proto-loader')
const { createPrompt, cowsay } = require('./lib')

const PROTO_PATH = __dirname + '/.protop/path/protop/pingpong/api.proto'

protoLoader.load(PROTO_PATH)
  .then(packageDefinition => {
    const protos = grpc.loadPackageDefinition(packageDefinition)
    const pingPongClient = new protos.protop.pingpong.PingPongService(
      'localhost:8080',
      grpc.credentials.createInsecure()
    )

    const exchange = pingPongClient.exchange()

    const { openPrompt, closePrompt } = createPrompt({
      'ping': () => exchange.write({/* Ping */})
    })

    exchange.on('data', data => {
      cowsay('pong')
      openPrompt()
    })

    exchange.on('end', () => {
      closePrompt()
      process.exit(0)
    })

    process.on('SIGINT', () => {
      closePrompt()
      exchange.end()
    })

    openPrompt()
  })
