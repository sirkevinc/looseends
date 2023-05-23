'use strict'

// const { port } = require('../config/environment')

import Fastify from "fastify";
import mercurius from "mercurius";

import { schema } from "../graphql/schema"

import { port } from "../config/environment"

const app = Fastify();

app.register(mercurius, {
    schema,
    graphiql: true
})

app.listen({ port }).then(() => {
    console.log(`🚀 Server ready at http://localhost:${port}/graphiql`)
})