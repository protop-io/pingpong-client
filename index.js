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

    const { prompt, close } = createPrompt({
      'ping': () => exchange.write({/* Ping */})
    })

    exchange.on('data', data => {
      cowsay('pong')
      prompt()
    })

    exchange.on('end', () => {
      close()
      process.exit(0)
    })

    process.on('SIGINT', () => {
      close()
      exchange.end()
    })

    prompt()
  })
