/**
 * Document Types
 * Used for attachments and related documents
 */

export interface Document {
  id: string
  name: string
  type: 'Contract' | 'Invoice' | 'Tax Form' | 'Agreement' | 'Report' | 'Other'
  url?: string
  size?: number
  uploadedAt?: Date
  uploadedBy?: string
}

export interface DocumentMetadata {
  mimeType?: string
  thumbnail?: string
  description?: string
  tags?: string[]
}


