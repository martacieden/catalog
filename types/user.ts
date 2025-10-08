/**
 * User and Team Types
 * Used across collections for ownership, sharing, and collaboration
 */

export interface User {
  id: string
  name: string
  email?: string
  avatar?: string
  role?: 'owner' | 'editor' | 'viewer'
}

export interface Team {
  id: string
  name: string
  members: User[]
}

export interface AccessControl {
  userId: string
  permission: 'view' | 'edit' | 'admin'
  grantedAt: Date
  grantedBy: string
}


