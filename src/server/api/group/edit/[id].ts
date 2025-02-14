import { PrismaClient } from '@prisma/client'

interface IGroup {
    name: string
    description: string
    city: string
    postalCode: string
}

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    if (!id) { throw new Error('Group ID is required') }

    const body = await readBody<IGroup>(event)

    const group = await prisma.group.update({
        where: { id },
        data: {
            name: body.name,
            description: body.description,
            city: body.city,
            postalCode: body.postalCode,
        },
    })

    return group
})

/* model Group {
  id             String      @id @default(cuid()) @db.VarChar(30)
  name           String
  description    String?
  invitationCode String      @unique
  ownerId        String      @db.VarChar(30)
  city           String?
  postalCode     String?
  createdAt      DateTime    @default(now())
  updatedAt      DateTime    @updatedAt
  members        GroupUser[]
  owner          Profile     @relation(fields: [ownerId], references: [id])
  tasks          Task[]
  Message        Message[]
  tags           Tag[]
  TaskRow        TaskRow[]
} */
