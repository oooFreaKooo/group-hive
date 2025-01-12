import { PrismaClient } from '@prisma/client'

const prisma = new PrismaClient()

/**
 * Generates a unique invitation code for a group
 * @returns A promise that resolves to a unique 8-character alphanumeric code
 */
export async function generateInviteCode (): Promise<string> {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
    const codeLength = 8
    let isUnique = false
    let code = ''

    while (!isUnique) {
        code = Array.from(
            { length: codeLength },
            () => characters.charAt(Math.floor(Math.random() * characters.length)),
        ).join('')

        // Check if the code is unique
        const existingGroup = await prisma.group.findUnique({
            where: { invitationCode: code },
        })

        if (!existingGroup) {
            isUnique = true
        }
    }

    return code
}

/**
 * Formats points to a human-readable string
 * @param points The number of points
 * @returns A formatted string (e.g., "1.2K" for 1200)
 */
export function formatPoints (points: number): string {
    if (points >= 1000000) {
        return `${(points / 1000000).toFixed(1)}M`
    }
    if (points >= 1000) {
        return `${(points / 1000).toFixed(1)}K`
    }
    return points.toString()
}

/**
 * Checks if a user has admin privileges in a group
 * @param userId The user's ID
 * @param group The group object with members
 * @returns True if the user is an admin or owner
 */
export function hasAdminPrivileges (userId: string, group: { ownerId: string, members: { profileId: string, role: string }[] }): boolean {
    if (userId === group.ownerId) { return true }
    const member = group.members.find(m => m.profileId === userId)
    return member?.role === 'ADMIN'
}
