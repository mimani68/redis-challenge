let app = require('./src/app')
const port = process.env.port || 3000

app.listen( port, ( err ) => {
  if ( err ) console.log( err )
    else console.log( `Auth service start in port ${port}` )
  }
)