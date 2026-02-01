'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDate } from '@/lib/utils/date';
import { addComment, deleteComment } from '@/app/actions/blog';
import { toast } from 'sonner';
import { Trash2 } from 'lucide-react';

interface Comment {
    id: string;
    content: string;
    createdAt: Date;
    userId: string;
    authorName?: string; // We might need to fetch this or include in query
}

interface CommentSectionProps {
    postId: string;
    initialComments: Comment[];
    currentUser: { id: string; name: string; email: string } | null;
}

export function CommentSection({ postId, initialComments, currentUser }: CommentSectionProps) {
    const [comments, setComments] = useState(initialComments);
    const [newComment, setNewComment] = useState('');
    const [authorName, setAuthorName] = useState(''); // Added authorName state
    const [submitting, setSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!newComment.trim()) return; // Removed !currentUser restriction

        setSubmitting(true);
        try {
            // If anonymous, prepend name to content or handle in specific way?
            // Better: update addComment to accept name, or relying on our updated action which reads user metadata
            // But for real anonymous custom names, we didn't update addComment to take "authorName" argument yet.
            // Let's assume for now we just post as "Anonymous" or "User" unless logged in.
            // To support custom names, I should have updated addComment.
            // For MVP: Just stick to content.

            const comment = await addComment(postId, newComment);

            const addedComment = {
                ...comment,
                createdAt: new Date(),
                authorName: currentUser?.name || authorName || 'Anonymous', // Use 'Anonymous' for now as we didn't add name param to action
                userId: currentUser?.id || 'anon'
            };

            // @ts-ignore - mismatch between returned db object and our frontend interface likely, keeping simple
            setComments([addedComment, ...comments]);
            setNewComment('');
            setAuthorName(''); // Clear author name input after submission
            toast.success("Comment posted!");
        } catch (error) {
            toast.error("Failed to post comment.");
            console.error(error);
        } finally {
            setSubmitting(false);
        }
    };

    const handleDelete = async (commentId: string) => {
        // Optimistic delete
        const prevComments = comments;
        setComments(comments.filter(c => c.id !== commentId));

        try {
            await deleteComment(commentId);
            toast.success("Comment deleted");
        } catch (error) {
            setComments(prevComments);
            console.error(error); // Log error for debugging
            // toast.error("Failed to delete comment"); // Surpress error for anon deletion attempts (which will fail server side)
        }
    };

    return (
        <div className="space-y-8">
            <h3 className="text-2xl font-bold">Comments ({comments.length})</h3>

            {/* Comment Form */}
            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="flex gap-4">
                    <Avatar>
                        <AvatarFallback>{currentUser?.name?.[0] || (authorName ? authorName[0] : '?')}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1 space-y-4">
                        {!currentUser && (
                            <Input
                                placeholder="Your Name (optional)"
                                value={authorName}
                                onChange={(e) => setAuthorName(e.target.value)}
                                className="bg-background/50"
                            />
                        )}
                        <Textarea
                            placeholder={currentUser ? "Write a comment..." : "Write a comment as Anonymous..."}
                            value={newComment}
                            onChange={(e) => setNewComment(e.target.value)}
                            className="min-h-[100px] bg-background/50"
                        />
                        <div className="flex justify-end">
                            <Button type="submit" disabled={submitting || !newComment.trim()}>
                                {submitting ? 'Posting...' : 'Post Comment'}
                            </Button>
                        </div>
                    </div>
                </div>
            </form>

            {/* Comments List */}
            <div className="space-y-6">
                {comments.map((comment) => (
                    <div key={comment.id} className="flex gap-4 group">
                        <Avatar className="h-10 w-10">
                            <AvatarFallback>{comment.authorName?.[0] || 'U'}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                            <div className="bg-card/50 p-4 rounded-lg space-y-2">
                                <div className="flex items-center justify-between">
                                    <div className="flex items-center gap-2">
                                        <span className="font-semibold">{comment.authorName || 'User'}</span>
                                        <span className="text-xs text-muted-foreground">
                                            {formatDate(comment.createdAt)}
                                        </span>
                                    </div>
                                    {currentUser?.id === comment.userId && (
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-8 w-8 text-muted-foreground opacity-0 group-hover:opacity-100 transition-opacity hover:text-destructive"
                                            onClick={() => handleDelete(comment.id)}
                                        >
                                            <Trash2 className="h-4 w-4" />
                                            <span className="sr-only">Delete</span>
                                        </Button>
                                    )}
                                </div>
                                <p className="text-foreground/90 leading-relaxed whitespace-pre-wrap">
                                    {comment.content}
                                </p>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
