import express from 'express'
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import jwt from 'express-jwt'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'

import { SECRET } from './config'
import { User } from './connectors'
import Schema from './schema'
// import Mocks from './mocks'
import Resolvers from './resolvers'

const port = 3000
const app = express()
const dburl = 'mongodb://127.0.0.1:27017/graph-test'

mongoose.connect(dburl)
mongoose.Promise = global.Promise

app.use(bodyParser.json())

const executableSchema = makeExecutableSchema({
  typeDefs: Schema,
  resolvers: Resolvers
})

/*
addMockFunctionsToSchema({
  schema: executableSchema,
  mocks: Mocks,
  preserveResolvers: true
})
*/

// End points
app.use('/graphql',
  jwt({
    secret: SECRET,
    credentialsRequired: false
  }),
  graphqlExpress(req => ({
    schema: executableSchema,
    context: {
      user: req.user
        ? User.findOne({ _id: req.user._id })
        : Promise.resolve(null)
    }
  }))
)

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql',
  subscriptionsEndpoint: `ws://localhost:${port}/subscriptions`
}))

/*
const init = async () => {
  try {
    await databaseInit(dburl)
    await seed()
    app.listen(port, () => console.log(`App listen ${port}`))
  } catch (e) {
    throw e
  }
}

init()
*/

app.listen(port, () => console.log(`
  Application port: ${port}
  Subscriptions port: ${port}
`))

SubscriptionServer.create({
  schema: executableSchema,
  execute,
  subscribe
}, {
  server: app,
  path: '/subscriptions'
})
