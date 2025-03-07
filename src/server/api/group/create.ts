import { PrismaClient } from '@prisma/client'
import { defineEventHandler, readBody, createError } from 'h3'
import { nanoid } from 'nanoid'
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
        const { name, description, city, postalCode } = await readBody(event)

        // Validate required fields
        const validation: Record<string, string> = {}
        if (!name?.trim()) { validation.name = 'Group name is required' }
        if (!city?.trim()) { validation.city = 'City is required' }
        if (!postalCode?.trim()) { validation.postalCode = 'Postal code is required' }

        if (Object.keys(validation).length > 0) {
            throw createError({
                statusCode: 400,
                statusMessage: 'Validation failed',
                data: { validation },
            })
        }

        // Generate a unique invitation code
        const invitationCode = nanoid(8)

        // Create the group
        const group = await prisma.group.create({
            data: {
                name,
                description: description || '',
                city,
                postalCode,
                ownerId: user.id,
                invitationCode,
            },
        })

        // Update the user's profile to include this group
        await prisma.profile.update({
            where: { id: user.id },
            data: {
                groupIds: {
                    push: group.id,
                },
            },
        })

        return group
    } catch (error: unknown) {
        console.error('Error creating group:', error)

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
