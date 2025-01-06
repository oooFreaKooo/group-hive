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
                            raw_user_meta_data: {
                                name: string
                                display_name: string
                                city: string
                                postcode: string
                                avatar_url: string | null
                            }
                            email: string
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
            task_categories: {
                Row: {
                    id: string
                    name: string
                    color: string
                    group_id: string
                    created_at: string
                }
                Insert: {
                    name: string
                    color: string
                    group_id: string
                }
            }
            tasks: {
                Row: {
                    id: string
                    title: string
                    description: string | null
                    group_id: string
                    category_id: string | null
                    assigned_to: string | null
                    created_by: string
                    points: number
                    due_date: string
                    completed_at: string | null
                    proof_image_url: string | null
                    created_at: string
                }
                Insert: {
                    title: string
                    description?: string
                    group_id: string
                    category_id?: string
                    assigned_to?: string
                    created_by: string
                    points?: number
                    due_date: string
                    completed_at?: string
                    proof_image_url?: string
                }
            }
        }
    }
}
