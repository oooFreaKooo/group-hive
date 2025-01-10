export interface Profile {
    id: string
    createdAt: Date
    updatedAt: Date
    role: 'USER' | 'ADMIN'
    displayName: string | null
    avatarUrl: string | null
    city: string | null
    postalCode: string | null
}

export interface GroupUser {
    id: number
    profile: Profile
    groupId: number
    createdAt: Date
    updatedAt: Date
    profileId: string
    role: 'ADMIN' | 'MEMBER'
    points: number
}

export interface Message {
    id: number
    content: string
    groupId: number
    authorId: number
    createdAt: string
    updatedAt: string
    isEdited: boolean
    replyToId: number | null
    author: GroupUser
    replyTo: Message | null
}

export interface MentionSuggestion {
    startPosition: number
    query: string
}
