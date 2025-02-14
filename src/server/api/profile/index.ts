import { PrismaClient } from '@prisma/client'
import { defineEventHandler, createError } from 'h3'
import { serverSupabaseUser } from '#supabase/server'

const prisma = new PrismaClient()

export default defineEventHandler(async (event) => {
    try {
        // Get the authenticated user directly
        const user = await serverSupabaseUser(event)
        if (!user) {
            throw createError({
                statusCode: 401,
                statusMessage: 'Unauthorized - Invalid authentication',
            })
        }

        // Get profile
        const profile = await prisma.profile.findUnique({
            where: {
                id: user.id,
            },
        })

        if (!profile) {
            throw createError({
                statusCode: 404,
                statusMessage: 'Profile not found',
            })
        }

        // Get owned groups
        const ownedGroups = await prisma.group.findMany({
            where: {
                ownerId: user.id,
            },
        })

        return {
            profile: {
                ...profile,
                ownedGroups,
            },
        }
    } catch (error: unknown) {
        console.error('Error fetching profile:', error)

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
