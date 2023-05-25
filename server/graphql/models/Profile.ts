import { builder } from "../../lib/builder"
import { prisma } from "../../lib/prisma-client"

const Profile = builder.prismaObject("Profile", {
    fields: t => ({
        id: t.exposeID("id"),
        bio: t.exposeString("bio", { nullable: true }),
        user: t.relation("user"),
        userId: t.exposeID("userId", { nullable: true })
    })
})

builder.queryField("profiles", (t) =>
    t.prismaField({
        type: [Profile],
        resolve: async (query, root, args, ctx, info) => {
            return prisma.profile.findMany({ ...query });
        },
    })
);

builder.queryField("profile", (t) =>
    t.prismaField({
        type: Profile,
        args: {
            userId: t.arg.id({ required: true }),
        },
        resolve: async (query, root, { userId }, ctx, info) => {
            return prisma.profile.findUnique({
                 ...query,
                 where: { userId: Number.parseInt(String(userId), 10)} 
            });
        },
    })
);


builder.mutationField("createProfile", (t) =>
    t.prismaField({
        type: Profile,
        args: {
            userId: t.arg.id({ required: true }),
            bio: t.arg.string()
        },
        resolve: async (query, root, { userId, bio }, ctx, info) => {
            const createdProfile = await prisma.profile.create({
                data: {
                    userId: Number.parseInt(String(userId), 10),
                    bio
                }
            })
            return createdProfile;
        }
    })
)

builder.mutationField("updateProfile", (t) =>
    t.prismaField({
        type: Profile,
        args: {
            profileId: t.arg.id(),
            userId: t.arg.id({ required: true }),
            bio: t.arg.string()
        },
        resolve: async (query, root, { profileId, userId, bio }, ctx, info) => {
            const updatedProfile = await prisma.profile.update({
                where: {
                    id: profileId,
                    userId: Number.parseInt(String(userId), 10)
                },
                data: {
                    bio
                }
            })
            return updatedProfile;
        }
    })
)

builder.mutationField("deleteProfile", (t) =>
    t.prismaField({
        type: Profile,
        args: {
            profileId: t.arg.id(),
        },
        resolve: async (query, root, { profileId }, ctx, info) => {
            const deletedProfile = await prisma.profile.delete({
                where: {
                    id: Number.parseInt(String(profileId), 10),
                }
            })
            return deletedProfile;
        }
    })
)

