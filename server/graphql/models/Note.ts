import { builder } from "../../lib/builder"
import { prisma } from "../../lib/prisma-client"

const Note = builder.prismaObject("Note", {
    fields: t => ({
        id: t.exposeID("id"),
        title: t.exposeString("title", { nullable: true }),
        content: t.exposeString("content"),
        user: t.relation("user"),
        userId: t.exposeID("userId", { nullable: true })
    })
})

builder.queryField("allNotes", (t) =>
    t.prismaField({
        type: [Note],
        resolve: async (query, root, args, ctx, info) => {
            return prisma.note.findMany({ ...query });
        },
    })
);

builder.queryField("getAllUsersNotes", (t) =>
    t.prismaField({
        type: [Note],
        resolve: async (query, root, args, ctx, info) => {
            const token = ctx.token;

            return prisma.note.findMany({ ...query });
        },
    })
);

builder.queryField("note", (t) =>
    t.prismaField({
        type: Note,
        args: {
            userId: t.arg.id({ required: true }),
        },
        resolve: async (query, root, { userId }, ctx, info) => {
            return prisma.note.findUnique({
                 ...query,
                 where: { userId: Number.parseInt(String(userId), 10)} 
            });
        },
    })
);


builder.mutationField("createNote", (t) =>
    t.prismaField({
        type: Note,
        args: {
            userId: t.arg.id({ required: true }),
            title: t.arg.string(),
            content: t.arg.string(),
        },
        resolve: async (query, root, { userId, title, content }, ctx, info) => {
            const createdNote = await prisma.note.create({
                data: {
                    userId: Number.parseInt(String(userId), 10),
                    title,
                    content
                }
            })
            return createdNote;
        }
    })
)

builder.mutationField("updateNote", (t) =>
    t.prismaField({
        type: Note,
        args: {
            userId: t.arg.id({ required: true }),
            noteId: t.arg.id({ required: true }),
            title: t.arg.string(),
            content: t.arg.string()
        },
        resolve: async (query, root, { userId, noteId, title, content }, ctx, info) => {
            const updatedNote = await prisma.note.update({
                where: {
                    id: noteId,
                    userId
                },
                data: {
                    title,
                    content
                }
            })
            return updatedNote;
        }
    })
)

builder.mutationField("deleteNote", (t) =>
    t.prismaField({
        type: Note,
        args: {
            noteId: t.arg.id(),
        },
        resolve: async (query, root, { noteId }, ctx, info) => {
            const deletedNote = await prisma.note.delete({
                where: {
                    id: Number.parseInt(String(noteId), 10),
                }
            })
            return deletedNote;
        }
    })
)

