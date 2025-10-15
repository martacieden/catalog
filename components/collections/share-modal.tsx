"use client"

import * as React from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { useToast } from "@/hooks/use-toast"
import { Share2, Copy, Mail, Link, X, Check } from "lucide-react"

interface ShareModalProps {
  collection: any | null
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function ShareModal({ collection, open, onOpenChange }: ShareModalProps) {
  const { toast } = useToast()
  
  // State
  const [email, setEmail] = React.useState("")
  const [role, setRole] = React.useState<"viewer" | "editor">("viewer")
  const [sharedEmails, setSharedEmails] = React.useState<Array<{ email: string; role: string }>>([])
  const [shareLink, setShareLink] = React.useState("")
  const [isGeneratingLink, setIsGeneratingLink] = React.useState(false)
  const [isSharing, setIsSharing] = React.useState(false)
  const [linkCopied, setLinkCopied] = React.useState(false)

  // Generate share link when modal opens
  React.useEffect(() => {
    if (open && collection) {
      const baseUrl = window.location.origin
      const link = `${baseUrl}/collections/${collection.id}/shared`
      setShareLink(link)
    }
  }, [open, collection])

  const handleAddEmail = () => {
    if (!email.trim()) {
      toast({
        title: "Email Required",
        description: "Please enter an email address.",
        variant: "destructive",
      })
      return
    }

    if (!isValidEmail(email)) {
      toast({
        title: "Invalid Email",
        description: "Please enter a valid email address.",
        variant: "destructive",
      })
      return
    }

    if (sharedEmails.some(item => item.email === email)) {
      toast({
        title: "Email Already Added",
        description: "This email has already been added to the share list.",
        variant: "destructive",
      })
      return
    }

    setSharedEmails(prev => [...prev, { email, role }])
    setEmail("")
    setRole("viewer")
  }

  const handleRemoveEmail = (emailToRemove: string) => {
    setSharedEmails(prev => prev.filter(item => item.email !== emailToRemove))
  }

  const handleShare = async () => {
    if (sharedEmails.length === 0) {
      toast({
        title: "No Recipients",
        description: "Please add at least one email address.",
        variant: "destructive",
      })
      return
    }

    setIsSharing(true)

    try {
      // Mock API call - replace with real implementation
      await new Promise(resolve => setTimeout(resolve, 2000))

      toast({
        title: "Collection Shared",
        description: `Collection has been shared with ${sharedEmails.length} recipient(s).`,
      })

      // Clear the form
      setSharedEmails([])
      onOpenChange(false)

    } catch (error) {
      toast({
        title: "Share Failed",
        description: "Failed to share collection. Please try again.",
        variant: "destructive",
      })
    } finally {
      setIsSharing(false)
    }
  }

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(shareLink)
      setLinkCopied(true)
      toast({
        title: "Link Copied",
        description: "Share link has been copied to clipboard.",
      })
      setTimeout(() => setLinkCopied(false), 2000)
    } catch (error) {
      toast({
        title: "Copy Failed",
        description: "Failed to copy link. Please try again.",
        variant: "destructive",
      })
    }
  }

  const isValidEmail = (email: string) => {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
  }

  const getRoleColor = (role: string) => {
    switch (role) {
      case "editor": return "bg-blue-100 text-blue-700 border-blue-200"
      case "viewer": return "bg-gray-100 text-gray-700 border-gray-200"
      default: return "bg-gray-100 text-gray-700 border-gray-200"
    }
  }

  if (!collection) return null

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share Collection
          </DialogTitle>
          <DialogDescription>
            Share "{collection.name}" with team members or generate a shareable link.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Share via Email */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Mail className="h-4 w-4" />
              Share via Email
            </h4>
            
            <div className="space-y-3">
              <div className="flex gap-2">
                <div className="flex-1">
                  <Label htmlFor="email">Email Address</Label>
                  <Input
                    id="email"
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Enter email address"
                    onKeyPress={(e) => e.key === "Enter" && handleAddEmail()}
                  />
                </div>
                <div className="w-32">
                  <Label htmlFor="role">Role</Label>
                  <Select value={role} onValueChange={(value: "viewer" | "editor") => setRole(value)}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="viewer">Viewer</SelectItem>
                      <SelectItem value="editor">Editor</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button onClick={handleAddEmail} disabled={!email.trim()}>
                    Add
                  </Button>
                </div>
              </div>

              {/* Shared Emails List */}
              {sharedEmails.length > 0 && (
                <div className="space-y-2">
                  <Label>Recipients</Label>
                  <div className="space-y-2">
                    {sharedEmails.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 border rounded-lg">
                        <div className="flex items-center gap-2">
                          <Mail className="h-4 w-4 text-muted-foreground" />
                          <span className="text-sm">{item.email}</span>
                          <Badge variant="outline" className={`text-xs ${getRoleColor(item.role)}`}>
                            {item.role}
                          </Badge>
                        </div>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => handleRemoveEmail(item.email)}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Share via Link */}
          <div>
            <h4 className="font-medium mb-3 flex items-center gap-2">
              <Link className="h-4 w-4" />
              Share via Link
            </h4>
            
            <div className="space-y-3">
              <div>
                <Label htmlFor="shareLink">Share Link</Label>
                <div className="flex gap-2">
                  <Input
                    id="shareLink"
                    value={shareLink}
                    readOnly
                    className="bg-gray-50"
                  />
                  <Button
                    variant="outline"
                    onClick={handleCopyLink}
                    disabled={linkCopied}
                  >
                    {linkCopied ? (
                      <Check className="h-4 w-4" />
                    ) : (
                      <Copy className="h-4 w-4" />
                    )}
                  </Button>
                </div>
                <p className="text-xs text-muted-foreground mt-1">
                  Anyone with this link can view the collection
                </p>
              </div>
            </div>
          </div>

          {/* Role Descriptions */}
          <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <h5 className="font-medium text-blue-800 mb-2">Role Permissions</h5>
            <div className="space-y-1 text-sm text-blue-700">
              <div><strong>Viewer:</strong> Can view collection and items</div>
              <div><strong>Editor:</strong> Can view, edit, and manage collection items</div>
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between pt-4">
          <div className="text-sm text-muted-foreground">
            {sharedEmails.length > 0 && `${sharedEmails.length} recipient(s) will be notified`}
          </div>
          
          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isSharing}
            >
              Cancel
            </Button>
            
            <Button
              onClick={handleShare}
              disabled={isSharing || sharedEmails.length === 0}
              className="bg-primary hover:bg-primary/90"
            >
              {isSharing ? "Sharing..." : `Share with ${sharedEmails.length} People`}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}











