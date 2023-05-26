import { builder } from "../../lib/builder"
import { prisma } from "../../lib/prisma-client"

import * as jwt from 'jsonwebtoken';

const User = builder.prismaObject("User", {
    fields: (t) => ({
        id: t.exposeID("id"),
        email: t.exposeString("email"),
        password: t.exposeString("password"),
        name: t.exposeString("name", { nullable: true }),
        profile: t.relation("profile"),
        notes: t.relation("notes")
    })
})

export class Token {
    token: string

    constructor(token: string) {
        this.token = token;

    }
}

const AuthToken = builder.objectType(Token, {
    name: 'AuthToken',
    fields: (t) => ({
        token: t.exposeString("token")
    }),
});

builder.queryField("users", (t) =>
    t.prismaField({
        type: [User],
        resolve: async (query, root, args, ctx, info) => {
            console.log(ctx)
            return prisma.user.findMany({ ...query });
        },
    })
);

builder.queryField("user", (t) =>
    t.prismaField({
        type: User,
        args: {
            userId: t.arg.id({ required: true }),
        },
        resolve: async (query, root, args, ctx, info) => {
            return prisma.user.findUnique({
                //  ...query,
                 where: { id: Number.parseInt(String(args.userId), 10)} 
            });
        },
    })
);


builder.queryField('login', (t) =>
  t.field({
    type: AuthToken,
    args: {
        email: t.arg.string({ required: true }),
        password: t.arg.string({ required: true }),
    },
    resolve: async (root, { email, password }, ctx) => {
        const test = await prisma.user.findFirst({
            where: {AND: [{ email },{ password }]}
        });
        const token = jwt.sign({ email: test.email, password: test.password }, 'mysecret');
        return new Token(token);
    }
  })
)


// builder.queryField("login", (t) =>
//     t.prismaField({
//         type: User,
//         args: {
//             email: t.arg.string({ required: true }),
//             password: t.arg.string({ required: true }),
//         },
//         resolve: async (query, root, { email, password }, ctx, info) => {
//             const userLoggingIn = prisma.user.findUnique({
//                  where: {
//                     email,
//                     password
//                  }
//             });
//             if (!userLoggingIn) {
//                 throw new Error ("unkonwn user!");
//             }
//             const token = jwt.sign({ email: userLoggingIn.email, password: userLoggingIn.password }, 'mysecret');
//             return token;
//         },
//     })
// );


builder.mutationField("createUser", (t) =>
    t.prismaField({
        type: User,
        args: {
            email: t.arg.string(),
            password: t.arg.string(),
            name: t.arg.string(),
        },
        resolve: async (query, root, { email, password, name }, ctx, info) => {
            const createdUser = await prisma.user.create({
                data: {
                    email,
                    password,
                    name
                }
            })
            const createdUserId: number = createdUser?.id;
            const createdProfile = await prisma.profile.create({
                data: {
                    userId: createdUserId,
                    bio: "Hello"
                }
            })
            console.log(`Profile for UserId: ${createdUserId} created`)
            
            return createdUser;
        }
    })
)

builder.mutationField("updateUser", (t) =>
    t.prismaField({
        type: User,
        args: {
            userId: t.arg.id(),
            name: t.arg.string(),
            email: t.arg.string(),
            password: t.arg.string(),
        },
        resolve: async (query, root, { email, password, name, userId }, ctx, info) => {
            const updatedUser = await prisma.user.update({
                data: {
                    email,
                    password,
                    name
                },
                where: {
                    userId: Number.parseInt(String(userId), 10)
                }
            })
            return updatedUser;
        }
    })
)

builder.mutationField("deleteUser", (t) =>
    t.prismaField({
        type: User,
        args: {
            userId: t.arg.id(),
        },
        resolve: async (query, root, { userId }, ctx, info) => {
            const id = Number.parseInt(String(userId), 10);
            const deleteUser = await prisma.user.delete({
                where: {
                    id
                }
            })
            return deleteUser;
        }
    })
)