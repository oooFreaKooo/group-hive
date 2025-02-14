import { PrismaClient } from '@prisma/client'

interface IProfile {
    displayName: string
    avatarUrl: string
    bgUrl: string
    city: string
    postalCode: string
}

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    const id = event.context.params?.id
    if (!id) { throw new Error('Profile ID is required') }

    const body = await readBody<IProfile>(event)

    const profile = await prisma.profile.update({
        where: { id },
        data: {
            displayName: body.displayName,
            avatarUrl: body.avatarUrl,
            bgUrl: body.bgUrl,
            city: body.city,
            postalCode: body.postalCode,
        },
    })

    return profile
})
