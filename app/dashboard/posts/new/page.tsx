import { PostEditor } from '@/components/dashboard/PostEditor';

export default function NewPostPage() {
  return (
    <div className="max-w-5xl">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-body">Create New Post</h1>
        <p className="text-accent mt-2">Write and publish a new blog post</p>
      </div>
      <PostEditor />
    </div>
  );
}
