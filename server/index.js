import express from 'express'
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import bodyParser from 'body-parser'
import mongoose from 'mongoose'
import jwt from 'express-jwt'
import { SubscriptionServer } from 'subscriptions-transport-ws'
import { execute, subscribe } from 'graphql'

import { seed, databaseInit } from './db'
import { SECRET } from './config'
import { User } from './connectors'
import Schema from './schema'
// import Mocks from './mocks'
import Resolvers from './resolvers'

mongoose.Promise = global.Promise

const port = 3000
const app = express()
const shouldSeed = false // Cambiar a true para seedear db !Borrara la base de datos actual
const dburl = 'mongodb://127.0.0.1:27017/graph-test'

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

const init = async () => {
  try {
    await databaseInit(shouldSeed, dburl)
    await seed(shouldSeed)

    app.listen(port, () => console.log(`
      Application port: ${port}
      Subscriptions port: ${port}
    `))
  } catch (e) {
    throw e
  }
}

init()

SubscriptionServer.create({
  schema: executableSchema,
  execute,
  subscribe
}, {
  server: app,
  path: '/subscriptions'
})
