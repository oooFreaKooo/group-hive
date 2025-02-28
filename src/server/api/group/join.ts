import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
    // Get the authenticated user
        const user = await serverSupabaseUser(event)
        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Invalid authentication',
            })
        }

        // Read request body
        const { invitationCode } = await readBody(event)

        // Validate required fields
        if (!invitationCode?.trim()) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Invitation code is required',
            })
        }

        // Find the group with the invitation code
        const group = await prisma.group.findUnique({
            where: {
                invitationCode,
            },
        })

        if (!group) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Group not found. Invalid invitation code.',
            })
        }

        // Get the user's profile
        const profile = await prisma.profile.findUnique({
            where: {
                id: user.id,
            },
        })

        if (!profile) {
            throw createError({
                statusCode: 404,
                statusMessage: 'User profile not found',
            })
        }

        // Check if user is already a member of this group
        if (profile.groupIds.includes(group.id)) {
            throw createError({
                statusCode: 400,
                statusMessage: 'You are already a member of this group',
            })
        }

        // Add the user to the group
        await prisma.profile.update({
            where: {
                id: user.id,
            },
            data: {
                groupIds: {
                    push: group.id,
                },
            },
        })

        return group
    } catch (error: unknown) {
        console.error('Error joining group:', error)

        // Handle known error types
        if (error && typeof error === 'object' && 'statusCode' in error) {
            throw error
        }

        // Handle unknown errors
        throw createError({
            statusCode: 500,
            statusMessage: error instanceof Error ? error.message : 'Internal server error',
        })
    }
})
