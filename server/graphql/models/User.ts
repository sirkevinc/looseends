import { builder } from "../../lib/builder"
import { prisma } from "../../lib/prisma-client"

builder.prismaObject("User", {
    fields: (t) => ({
        id: t.exposeID("id"),
        email: t.exposeString("email"),
        password: t.exposeString("password"),
        name: t.exposeString("name", { nullable: true }),
        profile: t.relation("profile")
    })
})

// builder.queryField("users", (t) =>
//     t.prismaField({
//         type: ["User"],
//         resolve: async (query, root, args, ctx, info) => {
//             return prisma.user.findMany({ ...query });
//         },
//     })
// );

builder.queryType({
    fields: (t) => ({
      user: t.prismaField({
        type: 'User',
        nullable: true,
        args: {
          id: t.arg.id({ required: true }),
        },
        resolve: async (query, root, args) =>
          prisma.user.findUnique({
            ...query,
            where: { id: Number.parseInt(String(args.id), 10) },
          }),
      }),
      users: t.prismaField({
        type: ['User'],
        nullable: true,
        resolve: (query, root, args) =>
          prisma.user.findMany({
            ...query,
          }),
      }),
    }),
  });

  builder.mutationType({
    fields: (t) => ({
        createUser: t.prismaField({
            type: 'User',
            args: {
                email: t.arg.string(),
                password: t.arg.string(),
                name: t.arg.string(),
            },
            resolve: async (query, root, { email, password, name }) => {
                const createdUser = await prisma.user.create({
                    ...query,
                    data: {
                        email,
                        password,
                        name
                    }
                })
                return createdUser;
            }
        })
    })
  })