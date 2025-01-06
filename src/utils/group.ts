import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Generates a unique invitation code for a group
 * @returns A unique 8-character alphanumeric code
 */
export async function generateInviteCode (): Promise<string> {
    const length = 8
    const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    let code: string
    let isUnique = false

    while (!isUnique) {
        code = ''
        for (let i = 0; i < length; i++) {
            code += chars.charAt(Math.floor(Math.random() * chars.length))
        }

        // Check if code is unique
        const existingGroup = await prisma.group.findUnique({
            where: { invitationCode: code },
        })

        if (!existingGroup) {
            isUnique = true
            return code
        }
    }

    // TypeScript needs this, but it will never be reached
    throw new Error('Failed to generate unique invite code')
}
