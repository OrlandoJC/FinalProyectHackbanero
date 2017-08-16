import express from 'express'
import { graphiqlExpress, graphqlExpress } from 'graphql-server-express'
import { makeExecutableSchema, addMockFunctionsToSchema } from 'graphql-tools'
import bodyParser from 'body-parser'

import Schema from './schema'
import Mocks from './mocks'
import Resolvers from './resolvers'

const port = 3000
const app = express()

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
app.use('/graphql', graphqlExpress({
  schema: executableSchema,
  context: {}
}))

app.use('/graphiql', graphiqlExpress({
  endpointURL: '/graphql'
}))

app.listen(port, () => console.log(`App listen ${port}`))
