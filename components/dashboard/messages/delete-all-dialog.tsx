"use client"

import { useState } from "react"
import { Trash2 } from "lucide-react"
import { useRouter } from "next/navigation"
import { toast } from "sonner"

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
import { apiClient } from "@/lib/utils/api"

export function DeleteAllDialog() {
    const [open, setOpen] = useState(false)
    const [loading, setLoading] = useState(false)
    const [confirmText, setConfirmText] = useState("")
    const router = useRouter()

    const handleDeleteAll = async () => {
        if (confirmText !== "delete/all") return

        setLoading(true)
        try {
            await apiClient.delete("/api/messages/delete-all")
            toast.success("All messages deleted successfully")
            setOpen(false)
            setConfirmText("")
            router.refresh()
        } catch (error) {
            toast.error("Failed to delete messages")
            console.error(error)
        } finally {
            setLoading(false)
        }
    }

    return (
        <Dialog open={open} onOpenChange={setOpen}>
            <DialogTrigger asChild>
                <Button variant="destructive" className="gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete All Messages
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Delete all messages?</DialogTitle>
                    <DialogDescription>
                        This action cannot be undone. This will permanently delete all messages
                        from your database.
                    </DialogDescription>
                </DialogHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid gap-2">
                        <Label htmlFor="confirm-text" className="text-sm font-medium">
                            Type <span className="font-mono font-bold">delete/all</span> to
                            confirm:
                        </Label>
                        <Input
                            id="confirm-text"
                            value={confirmText}
                            onChange={(e) => setConfirmText(e.target.value)}
                            placeholder="delete/all"
                            className="col-span-3"
                            disabled={loading}
                            autoComplete="off"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <Button
                        variant="outline"
                        onClick={() => setOpen(false)}
                        disabled={loading}
                    >
                        Cancel
                    </Button>
                    <Button
                        variant="destructive"
                        onClick={handleDeleteAll}
                        disabled={confirmText !== "delete/all" || loading}
                    >
                        {loading ? "Deleting..." : "Confirm Delete"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
