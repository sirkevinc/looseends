import SchemaBuilder from '@pothos/core';
import { DateResolver } from 'graphql-scalars';
import PrismaPlugin from "@pothos/plugin-prisma"
import type PrismaTypes from "@pothos/plugin-prisma/generated"
import SimpleObjectsPlugin from '@pothos/plugin-simple-objects'


import { prisma } from './prisma-client';

export const builder = new SchemaBuilder<{
    Scalars: {
        Date: { Input: Date; Output: Date };
    };
    PrismaTypes: PrismaTypes;
}>({
    plugins: [PrismaPlugin, SimpleObjectsPlugin],
    prisma: {
        client: prisma,
    }
});

builder.addScalarType("Date", DateResolver, {});

builder.queryType({});
builder.mutationType({});