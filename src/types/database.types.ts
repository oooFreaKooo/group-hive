export interface Database {
  public: {
    Tables: {
      groups: {
        Row: {
          id: string
          created_at: string
          name: string
          description: string | null
          invite_code: string
          created_by: string
          members?: {
            user: {
              id: string
              name: string
              avatar_url: string | null
            }
            points: number
          }[]
        }
        Insert: {
          name: string
          description?: string
          invite_code?: string
          created_by: string
        }
      }
      group_members: {
        Row: {
          id: string
          created_at: string
          group_id: string
          user_id: string
          role: 'admin' | 'member'
          points: number
        }
        Insert: {
          group_id: string
          user_id: string
          role: 'admin' | 'member'
        }
      }
      profiles: {
        Row: {
          id: string
          created_at: string
          name: string
          avatar_url: string | null
        }
      }
    }
  }
} 