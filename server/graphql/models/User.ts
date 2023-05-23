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

builder.queryField("users", (t) =>
    t.prismaField({
        type: ["User"],
        resolve: async (query, root, args, ctx, info) => {
            return prisma.user.findMany({ ...query });
        },
    })
);