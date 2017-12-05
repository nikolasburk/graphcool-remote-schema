require('isomorphic-fetch')
const { makeRemoteExecutableSchema, introspectSchema } = require('graphql-tools')
const { GraphQLServer } = require('graphql-yoga')
const { createHttpLink } = require('apollo-link-http')

const { USER_SERVICE_ID } = require('./services')

async function run() {
  // 1. Create Apollo Link that's connected to the underlying GraphQL API
  const makeUserServiceLink = () => createHttpLink({
    uri: `https://api.graph.cool/simple/v1/${USER_SERVICE_ID}`
  })

  // 2. Retrieve schema definition of the underlying GraphQL API 
  const userServiceSchemaDefinition = await introspectSchema(makeUserServiceLink())

  // 3. Create the executable schema based on schema definition and Apollo Link
  const userServiceExecutableSchema = makeRemoteExecutableSchema({
    schema: userServiceSchemaDefinition,
    link: makeUserServiceLink()
  })

  // 4. Create and start proxy server based on the executable schema
  const server = new GraphQLServer({ schema: userServiceExecutableSchema })
  server.start(() => console.log('Server is running on http://localhost:4000'))
}

run()