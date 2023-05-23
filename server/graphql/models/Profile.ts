import { builder } from "../../lib/builder"

builder.prismaObject("Profile", {
    fields: t => ({
        id: t.exposeID("id"),
        bio: t.exposeString("bio", { nullable: true }),
        user: t.relation("user"),
        userId: t.exposeID("userId")
    })
})