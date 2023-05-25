import SchemaBuilder from '@pothos/core';
import { JSONObjectResolver, DateResolver } from 'graphql-scalars';
import PrismaPlugin from "@pothos/plugin-prisma"
import type PrismaTypes from "@pothos/plugin-prisma/generated"

import { prisma } from './prisma-client';

export const builder = new SchemaBuilder<{
    Scalars: {
        Date: { Input: Date; Output: Date };
        JSONObject: { Input: any; Output: any }
    };
    PrismaTypes: PrismaTypes;
}>({
    plugins: [PrismaPlugin],
    prisma: {
        client: prisma,
    }
});

builder.addScalarType("Date", DateResolver, {});
builder.addScalarType("JSONObject", JSONObjectResolver, {});

builder.queryType({});
builder.mutationType({});