'use client';

import { useRouter } from 'next/navigation';
import { Button } from '@/components/ui/button';
import { Trash2 } from 'lucide-react';
import { useState } from 'react';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
    AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import { toast } from 'sonner';

import { cn } from '@/lib/utils';
import { apiClient } from '@/lib/utils/api';

export function DeleteMessageButton({ messageId, className }: { messageId: string, className?: string }) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [open, setOpen] = useState(false);

    const handleDelete = async () => {
        setLoading(true);
        try {
            await apiClient.delete(`/api/messages/${messageId}`);

            setOpen(false);
            router.refresh();
            toast.success('Message deleted successfully');
        } catch {
            toast.error('Failed to delete message');
        } finally {
            setLoading(false);
        }
    };

    return (
        <AlertDialog open={open} onOpenChange={setOpen}>
            <AlertDialogTrigger asChild>
                <Button
                    variant="outline"
                    size="sm"
                    className={cn("border-red-500/50 text-red-500 hover:bg-red-500/10 hover:text-red-600 hover:border-red-500 transition-colors h-8 w-8 p-0", className)}
                >
                    <Trash2 className="h-4 w-4" />
                    <span className="sr-only">Delete</span>
                </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
                <AlertDialogHeader>
                    <AlertDialogTitle>Delete Message?</AlertDialogTitle>
                    <AlertDialogDescription>
                        This action cannot be undone. This will permanently delete the message from the database.
                    </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                    <AlertDialogCancel disabled={loading}>Cancel</AlertDialogCancel>
                    <AlertDialogAction
                        onClick={(e) => {
                            e.preventDefault();
                            handleDelete();
                        }}
                        disabled={loading}
                        className="bg-red-500 hover:bg-red-600 text-white"
                    >
                        {loading ? 'Deleting...' : 'Delete'}
                    </AlertDialogAction>
                </AlertDialogFooter>
            </AlertDialogContent>
        </AlertDialog>
    );
}
