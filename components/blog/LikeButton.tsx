'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { toggleLike, getLikeStatus } from '@/app/actions/blog';
import { toast } from 'sonner';

interface LikeButtonProps {
    postId: string;
    initialLikes: number;
    initialLiked: boolean;
}

export function LikeButton({ postId, initialLikes, initialLiked }: LikeButtonProps) {
    const [likes, setLikes] = useState(initialLikes);
    const [isLiked, setIsLiked] = useState(initialLiked);
    const [loading, setLoading] = useState(false);
    const [sessionId, setSessionId] = useState<string>('');

    // Initialize session ID and check like status
    useEffect(() => {
        if (typeof window !== 'undefined') {
            let sid = localStorage.getItem('blog_session_id');
            if (!sid) {
                sid = crypto.randomUUID();
                localStorage.setItem('blog_session_id', sid);
            }
            setSessionId(sid);

            // Fetch like status for anonymous user if not already liked (from server auth)
            if (!initialLiked && sid) {
                getLikeStatus(postId, sid).then(liked => {
                    if (liked) setIsLiked(true);
                });
            }
        }
    }, [postId, initialLiked]);

    const handleLike = async () => {
        if (loading) return;

        // Optimistic update
        const previousLikes = likes;
        const previousIsLiked = isLiked;

        setLikes(prev => isLiked ? prev - 1 : prev + 1);
        setIsLiked(!isLiked);
        setLoading(true);

        try {
            await toggleLike(postId, sessionId);
        } catch (error) {
            // Revert on error
            setLikes(previousLikes);
            setIsLiked(previousIsLiked);
            toast.error("Failed to update like. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <Button
            variant="outline"
            size="lg"
            className={cn(
                "gap-2 transition-all duration-300",
                isLiked ? "text-red-500 border-red-500/50 bg-red-500/5 hover:bg-red-500/10" : "hover:text-red-500 hover:border-red-500/50"
            )}
            onClick={handleLike}
            disabled={loading}
        >
            <Heart className={cn("h-5 w-5", isLiked && "fill-current")} />
            <span className="font-semibold">{likes}</span>
            <span className="sr-only">Likes</span>
        </Button>
    );
}
