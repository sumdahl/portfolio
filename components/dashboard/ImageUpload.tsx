'use client';

import { useState } from 'react';
import { createBrowserClient } from '@supabase/ssr';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { ImagePlus, X, Loader2 } from 'lucide-react';
import Image from 'next/image';
import { toast } from 'sonner';

interface ImageUploadProps {
    value: string;
    onChange: (url: string) => void;
    disabled?: boolean;
}

export function ImageUpload({ value, onChange, disabled }: ImageUploadProps) {
    const [isUploading, setIsUploading] = useState(false);
    const [isDragging, setIsDragging] = useState(false);

    const supabase = createBrowserClient(
        process.env.NEXT_PUBLIC_SUPABASE_URL!,
        process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const onUpload = async (file: File) => {
        setIsUploading(true);

        try {
            const fileExt = file.name.split('.').pop();
            const fileName = `${Math.random()}.${fileExt}`;
            const filePath = `${fileName}`;

            const { error: uploadError } = await supabase.storage
                .from('blog-images')
                .upload(filePath, file);

            if (uploadError) {
                throw uploadError;
            }

            const { data } = supabase.storage
                .from('blog-images')
                .getPublicUrl(filePath);

            onChange(data.publicUrl);
            toast.success('Image uploaded successfully');
        } catch (error) {
            console.error('Upload error:', error);
            toast.error('Failed to upload image. Make sure the bucket exists and is public.');
        } finally {
            setIsUploading(false);
        }
    };

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        if (file) onUpload(file);
    };

    const handleDragOver = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(true);
    };

    const handleDragLeave = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
    };

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault();
        setIsDragging(false);
        const file = e.dataTransfer.files?.[0];
        if (file && file.type.startsWith('image/')) {
            onUpload(file);
        } else if (file) {
            toast.error('Please upload an image file');
        }
    };

    if (value) {
        return (
            <div className="relative w-full h-64 bg-muted rounded-lg overflow-hidden border border-border group">
                <div className="absolute top-2 right-2 z-10 opacity-0 group-hover:opacity-100 transition-opacity">
                    <Button
                        type="button"
                        onClick={() => onChange('')}
                        variant="destructive"
                        size="icon"
                        disabled={disabled}
                    >
                        <X className="h-4 w-4" />
                    </Button>
                </div>
                <Image
                    fill
                    src={value}
                    alt="Cover Image"
                    className="object-cover"
                />
            </div>
        );
    }

    return (
        <div
            className={`relative w-full h-64 rounded-lg border-2 border-dashed flex flex-col items-center justify-center gap-4 transition-colors
                ${isDragging
                    ? 'border-primary bg-primary/10'
                    : 'border-muted-foreground/25 bg-muted/30 hover:bg-muted/50'
                }
            `}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
        >
            <div className="flex flex-col items-center gap-2 text-muted-foreground pointer-events-none">
                {isUploading ? (
                    <Loader2 className="h-10 w-10 animate-spin text-primary" />
                ) : (
                    <ImagePlus className={`h-10 w-10 ${isDragging ? 'text-primary' : ''}`} />
                )}
                <p className="text-sm font-medium">
                    {isUploading ? 'Uploading...' : 'Drag & drop or click to upload'}
                </p>
                <p className="text-xs text-muted-foreground/75">
                    Supports JPG, PNG, WEBP
                </p>
            </div>
            <Input
                type="file"
                accept="image/*"
                className="w-full h-full absolute inset-0 opacity-0 cursor-pointer z-10"
                onChange={handleFileChange}
                disabled={disabled || isUploading}
            />
        </div>
    );
}
