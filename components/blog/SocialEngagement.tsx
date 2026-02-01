'use client';

import { LikeButton } from './LikeButton';
import { ShareOptions } from './ShareOptions';
import { CommentSection } from './CommentSection';
import { Separator } from '@/components/ui/separator';

interface SocialEngagementProps {
    post: {
        id: string;
        title: string;
        slug: string;
    };
    initialLikes: number;
    initialLiked: boolean;
    initialComments: any[];
    currentUser: any;
}

export function SocialEngagement({
    post,
    initialLikes,
    initialLiked,
    initialComments,
    currentUser
}: SocialEngagementProps) {
    return (
        <section className="mt-16 max-w-3xl mx-auto">
            <Separator className="mb-8" />

            {/* Actions Bar */}
            <div className="flex flex-col sm:flex-row items-center justify-between gap-6 mb-12">
                <LikeButton
                    postId={post.id}
                    initialLikes={initialLikes}
                    initialLiked={initialLiked}
                />
                <ShareOptions
                    title={post.title}
                    slug={post.slug}
                />
            </div>

            {/* Comments */}
            <CommentSection
                postId={post.id}
                initialComments={initialComments}
                currentUser={currentUser}
            />
        </section>
    );
}
