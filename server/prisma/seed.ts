import { PrismaClient } from '@prisma/client'
const prisma = new PrismaClient()

async function main() {
  const alice = await prisma.user.upsert({
    where: { email: 'alice@prisma.io' },
    update: {},
    create: {
      email: 'alice@prisma.io',
      name: 'Alice',
      password: 'password',
      profile: {
        create: {
            bio: "Test"
        }
      },
      notes: {
        create: {
          title: "My first note",
          content: "Wow this is great!"
        }
      }
    },
  })
  const bob = await prisma.user.upsert({
    where: { email: 'bob@prisma.io' },
    update: {},
    create: {
      email: 'bob@prisma.io',
      name: 'Bob',
      password: 'password',
      profile: {
        create: {
            bio: "Test"
        }
      },
      notes: {
        create: {
          title: "My first note",
          content: "Wow this is great!"
        }
      }
    },
  })
}

main()
  .then(async () => {
    await prisma.$disconnect()
  })
  .catch(async (e) => {
    console.error(e)
    await prisma.$disconnect()
    process.exit(1)
  })
