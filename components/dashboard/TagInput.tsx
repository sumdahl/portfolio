'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { X, Tag as TagIcon } from 'lucide-react';

interface TagInputProps {
    tags: string[];
    onChange: (tags: string[]) => void;
}

export function TagInput({ tags, onChange }: TagInputProps) {
    const [tagInput, setTagInput] = useState('');

    const addTag = () => {
        if (tagInput && !tags.includes(tagInput)) {
            onChange([...tags, tagInput]);
            setTagInput('');
        }
    };

    const removeTag = (tag: string) => {
        onChange(tags.filter((t) => t !== tag));
    };

    return (
        <div className="space-y-2">
            <label className="text-sm font-medium text-foreground flex items-center gap-2">
                <TagIcon className="h-3.5 w-3.5 text-muted-foreground" />
                Tags
            </label>
            <div className="flex gap-2">
                <Input
                    value={tagInput}
                    onChange={(e) => setTagInput(e.target.value)}
                    onKeyPress={(e) => e.key === 'Enter' && (e.preventDefault(), addTag())}
                    placeholder="Add tag..."
                    className="bg-background/50 h-9"
                />
                <Button type="button" onClick={addTag} size="sm" variant="secondary" className="px-3">
                    Add
                </Button>
            </div>
            <div className="flex flex-wrap gap-1.5 mt-2">
                {tags.map((tag) => (
                    <Badge key={tag} variant="outline" className="bg-primary/10 text-primary border-primary/20 hover:border-primary/50 transition-colors pl-2 pr-1 py-0.5">
                        {tag}
                        <button onClick={() => removeTag(tag)} className="ml-1.5 hover:bg-primary/20 rounded-full p-0.5 transition-colors">
                            <X className="h-3 w-3" />
                        </button>
                    </Badge>
                ))}
            </div>
        </div>
    );
}
