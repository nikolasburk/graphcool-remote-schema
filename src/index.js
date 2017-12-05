const fetch = require('node-fetch')
const { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools')
const { GraphQLServer } = require('graphql-yoga')
const { createHttpLink } = require('apollo-link-http')

const { DATABASE_SERVICE_ID } = require('./services')

async function run() {
  // 1. Create Apollo Link that's connected to the underlying GraphQL API
  const makeDatabaseServiceLink = () => createHttpLink({
    uri: `https://api.graph.cool/simple/v1/${DATABASE_SERVICE_ID}`,
    fetch
  })

  // 2. Retrieve schema definition of the underlying GraphQL API 
  const databaseServiceSchemaDefinition = await introspectSchema(makeDatabaseServiceLink())

  // 3. Create the executable schema based on schema definition and Apollo Link
  const databaseServiceExecutableSchema = makeRemoteExecutableSchema({
    schema: databaseServiceSchemaDefinition,
    link: makeDatabaseServiceLink()
  })
  debugger

  // 4. Create and start proxy server based on the executable schema
  const server = new GraphQLServer({ schema: databaseServiceExecutableSchema })
  server.start(() => console.log('Server is running on http://localhost:4000'))
}

run()