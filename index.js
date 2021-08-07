let { App } = require('./src/app')

let config = {
  host: 'redis',
  password: 'bnf9cU34naC9'
}

let app = new App(config)

app
  .defineVariables()
  .defineGroup()
  .launch()