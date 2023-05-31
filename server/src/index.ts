'use strict'

// const { port } = require('../config/environment')

import Fastify from "fastify";
import mercurius from "mercurius";
import { schema } from "../graphql/schema"

import { port } from "../config/environment"

import * as jwt from 'jsonwebtoken'

const app = Fastify({ logger: true });

app.register(mercurius, {
    schema,
    context: (request, reply) => {
        return {
            token: request.headers.authorization
        }
    },
    graphiql: true
})

app.listen({ port }).then(() => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphiql`)
})