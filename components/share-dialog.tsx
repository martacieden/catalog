"use client"

import * as React from "react"
import { Share2, Copy, Check, Mail, LinkIcon, Eye, Edit, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Avatar, AvatarFallback } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { Switch } from "@/components/ui/switch"

type Permission = "view" | "edit"

interface SharedUser {
  id: string
  name: string
  email: string
  avatar: string
  permission: Permission
}

const mockSharedUsers: SharedUser[] = [
  { id: "1", name: "John Smith", email: "john@example.com", avatar: "JS", permission: "edit" },
  { id: "2", name: "Jane Doe", email: "jane@example.com", avatar: "JD", permission: "view" },
  { id: "3", name: "Bob Wilson", email: "bob@example.com", avatar: "BW", permission: "edit" },
]

export function ShareDialog({
  trigger,
  collectionName = "Legal Entities",
}: { trigger?: React.ReactNode; collectionName?: string }) {
  const [open, setOpen] = React.useState(false)
  const [sharedUsers, setSharedUsers] = React.useState<SharedUser[]>(mockSharedUsers)
  const [email, setEmail] = React.useState("")
  const [linkCopied, setLinkCopied] = React.useState(false)
  const [publicAccess, setPublicAccess] = React.useState(false)
  const [defaultPermission, setDefaultPermission] = React.useState<Permission>("view")

  const handleCopyLink = () => {
    navigator.clipboard.writeText("https://way2bi.app/collections/legal-entities")
    setLinkCopied(true)
    setTimeout(() => setLinkCopied(false), 2000)
  }

  const handleInvite = () => {
    if (!email) return

    const newUser: SharedUser = {
      id: Date.now().toString(),
      name: email.split("@")[0],
      email,
      avatar: email.substring(0, 2).toUpperCase(),
      permission: defaultPermission,
    }

    setSharedUsers([...sharedUsers, newUser])
    setEmail("")
  }

  const handlePermissionChange = (userId: string, permission: Permission) => {
    setSharedUsers(sharedUsers.map((user) => (user.id === userId ? { ...user, permission } : user)))
  }

  const handleRemoveUser = (userId: string) => {
    setSharedUsers(sharedUsers.filter((user) => user.id !== userId))
  }

  const getPermissionIcon = (permission: Permission) => {
    switch (permission) {
      case "view":
        return <Eye className="h-3 w-3" />
      case "edit":
        return <Edit className="h-3 w-3" />
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        {trigger || (
          <Button variant="outline" size="sm" className="gap-2 bg-transparent">
            <Share2 className="h-4 w-4" />
            Share
          </Button>
        )}
      </DialogTrigger>
      <DialogContent className="max-w-2xl">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Share2 className="h-5 w-5" />
            Share "{collectionName}"
          </DialogTitle>
          <DialogDescription>Invite people to collaborate or share a link to this collection</DialogDescription>
        </DialogHeader>

        <div className="space-y-6 py-4">
          {/* Invite Section */}
          <div className="space-y-3">
            <Label>Invite people</Label>
            <div className="flex gap-2">
              <div className="relative flex-1">
                <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                <Input
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="pl-9"
                  onKeyDown={(e) => e.key === "Enter" && handleInvite()}
                />
              </div>
              <Select value={defaultPermission} onValueChange={(value) => setDefaultPermission(value as Permission)}>
                <SelectTrigger className="w-36">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="view">
                    <div className="flex items-center gap-2">
                      <Eye className="h-4 w-4" />
                      View Only
                    </div>
                  </SelectItem>
                  <SelectItem value="edit">
                    <div className="flex items-center gap-2">
                      <Edit className="h-4 w-4" />
                      Can Edit
                    </div>
                  </SelectItem>
                </SelectContent>
              </Select>
              <Button onClick={handleInvite} disabled={!email}>
                Invite
              </Button>
            </div>
          </div>

          <Separator />

          {/* Shared Users List */}
          <div className="space-y-3">
            <Label>People with access ({sharedUsers.length})</Label>
            <div className="max-h-64 space-y-2 overflow-y-auto">
              {sharedUsers.map((user) => (
                <div key={user.id} className="flex items-center justify-between rounded-lg border border-border p-3">
                  <div className="flex items-center gap-3">
                    <Avatar className="h-9 w-9">
                      <AvatarFallback>{user.avatar}</AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium">{user.name}</p>
                      <p className="text-sm text-muted-foreground">{user.email}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Select
                      value={user.permission}
                      onValueChange={(value) => handlePermissionChange(user.id, value as Permission)}
                    >
                      <SelectTrigger className="w-36">
                        <SelectValue>
                          <div className="flex items-center gap-2">
                            {getPermissionIcon(user.permission)}
                            <span>{user.permission === "view" ? "View Only" : "Can Edit"}</span>
                          </div>
                        </SelectValue>
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="view">
                          <div className="flex items-center gap-2">
                            <Eye className="h-4 w-4" />
                            View Only
                          </div>
                        </SelectItem>
                        <SelectItem value="edit">
                          <div className="flex items-center gap-2">
                            <Edit className="h-4 w-4" />
                            Can Edit
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <Button variant="ghost" size="icon" onClick={() => handleRemoveUser(user.id)}>
                      <Trash2 className="h-4 w-4 text-destructive" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <Separator />

          {/* Link Sharing */}
          <div className="space-y-3">
            <div className="flex items-center justify-between">
              <div>
                <Label>Public link access</Label>
                <p className="text-sm text-muted-foreground">Anyone with the link can access</p>
              </div>
              <Switch checked={publicAccess} onCheckedChange={setPublicAccess} />
            </div>

            {publicAccess && (
              <div className="space-y-2">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <LinkIcon className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
                    <Input value="https://way2bi.app/collections/legal-entities" readOnly className="pl-9" />
                  </div>
                  <Button onClick={handleCopyLink} variant="outline">
                    {linkCopied ? (
                      <>
                        <Check className="mr-2 h-4 w-4" />
                        Copied
                      </>
                    ) : (
                      <>
                        <Copy className="mr-2 h-4 w-4" />
                        Copy
                      </>
                    )}
                  </Button>
                </div>
                <div className="rounded-lg bg-muted/50 p-3">
                  <p className="text-sm text-muted-foreground">
                    Link access:{" "}
                    <Badge variant="secondary" className="ml-2">
                      View only
                    </Badge>
                  </p>
                </div>
              </div>
            )}
          </div>

          <div className="rounded-lg border border-border bg-muted/30 p-4">
            <p className="mb-2 text-sm font-medium">Permission levels:</p>
            <div className="space-y-1 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Eye className="h-3 w-3" />
                <span>
                  <strong>View Only:</strong> Can view collection and items, but cannot make changes
                </span>
              </div>
              <div className="flex items-center gap-2">
                <Edit className="h-3 w-3" />
                <span>
                  <strong>Can Edit:</strong> Can view, add, modify, and remove items in the collection
                </span>
              </div>
            </div>
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => setOpen(false)}>
            Done
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
