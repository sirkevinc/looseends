import { builder } from "../../lib/builder"
import { prisma } from "../../lib/prisma-client"

const User = builder.prismaObject("User", {
    fields: (t) => ({
        id: t.exposeID("id"),
        email: t.exposeString("email"),
        password: t.exposeString("password"),
        name: t.exposeString("name", { nullable: true }),
        profile: t.relation("profile"),
    })
})

builder.queryField("users", (t) =>
    t.prismaField({
        type: [User],
        resolve: async (query, root, args, ctx, info) => {
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