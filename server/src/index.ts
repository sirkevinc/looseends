'use strict'

const Fastify = require('fastify')
const mercurius = require('mercurius')

const { prisma } =  require('../lib/prisma-client')
const { port } = require('../config/environment')

const app = Fastify();

const schema = `
    type Query {
        hi: String
    }
`

const resolvers = {
    Query: {
        hi: async (_, __) => "how are you?"
    }
}

app.register(mercurius, {
    schema,
    resolvers, 
    context: (request, reply) => {
        return { prisma }
    },
    graphiql: true
})

app.listen({ port }).then(() => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphiql`)
})