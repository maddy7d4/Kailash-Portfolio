"use client"

import { useState, useRef } from "react"
import { Upload, Link, X, Loader2, ImageIcon } from "lucide-react"
import { LazyImage } from "@/components/ui/lazy-image"

interface ImageUploadProps {
    value: string
    onChange: (url: string) => void
    placeholder?: string
    label?: string
    required?: boolean
}

// Compress and resize image to thumbnail dimensions before upload
function compressImage(file: File, maxWidth = 800, maxHeight = 600, quality = 0.8): Promise<Blob> {
    return new Promise((resolve, reject) => {
        const img = new Image()
        const objectUrl = URL.createObjectURL(file)
        img.onload = () => {
            URL.revokeObjectURL(objectUrl)
            let { width, height } = img
            if (width > maxWidth || height > maxHeight) {
                const ratio = Math.min(maxWidth / width, maxHeight / height)
                width = Math.round(width * ratio)
                height = Math.round(height * ratio)
            }
            const canvas = document.createElement('canvas')
            canvas.width = width
            canvas.height = height
            const ctx = canvas.getContext('2d')!
            ctx.drawImage(img, 0, 0, width, height)
            canvas.toBlob(
                (blob) => blob ? resolve(blob) : reject(new Error('Compression failed')),
                'image/jpeg',
                quality
            )
        }
        img.onerror = () => { URL.revokeObjectURL(objectUrl); reject(new Error('Failed to load image')) }
        img.src = objectUrl
    })
}

export function ImageUpload({ value, onChange, placeholder = "https://...", label, required }: ImageUploadProps) {
    const [mode, setMode] = useState<'url' | 'upload'>('url')
    const [isUploading, setIsUploading] = useState(false)
    const [error, setError] = useState<string | null>(null)
    const [dragOver, setDragOver] = useState(false)
    const inputRef = useRef<HTMLInputElement>(null)

    const handleFile = async (file: File) => {
        setError(null)
        setIsUploading(true)
        try {
            const compressed = await compressImage(file)
            const compressedFile = new File([compressed], file.name.replace(/\.\w+$/, '.jpg'), { type: 'image/jpeg' })
            const formData = new FormData()
            formData.append('file', compressedFile)
            const res = await fetch('/api/upload', { method: 'POST', body: formData })
            const data = await res.json()
            if (!res.ok) {
                setError(data.error || 'Upload failed')
                return
            }
            onChange(data.url)
        } catch {
            setError('Upload failed. Please try again.')
        } finally {
            setIsUploading(false)
        }
    }

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0]
        if (file) handleFile(file)
    }

    const handleDrop = (e: React.DragEvent) => {
        e.preventDefault()
        setDragOver(false)
        const file = e.dataTransfer.files?.[0]
        if (file) handleFile(file)
    }

    return (
        <div className="space-y-2">
            {label && (
                <label className="block text-sm font-medium mb-2">
                    {label} {required && <span className="text-primary">*</span>}
                </label>
            )}

            {/* Mode toggle */}
            <div className="flex gap-1 p-1 rounded-lg bg-background/50 border border-white/10 w-fit">
                <button
                    type="button"
                    onClick={() => setMode('url')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        mode === 'url' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Link className="w-3 h-3" />
                    URL
                </button>
                <button
                    type="button"
                    onClick={() => setMode('upload')}
                    className={`px-3 py-1 rounded text-xs font-medium transition-colors flex items-center gap-1.5 ${
                        mode === 'upload' ? 'bg-primary text-white' : 'text-muted-foreground hover:text-foreground'
                    }`}
                >
                    <Upload className="w-3 h-3" />
                    Upload
                </button>
            </div>

            {mode === 'url' ? (
                <input
                    type="text"
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    className="w-full px-3 py-2 rounded-lg bg-background/50 backdrop-blur-sm border border-white/10 focus:border-primary focus:outline-none transition-colors text-sm"
                />
            ) : (
                <div
                    onDragOver={(e) => { e.preventDefault(); setDragOver(true) }}
                    onDragLeave={() => setDragOver(false)}
                    onDrop={handleDrop}
                    onClick={() => !isUploading && inputRef.current?.click()}
                    className={`relative w-full min-h-[80px] rounded-lg border-2 border-dashed transition-colors cursor-pointer flex items-center justify-center ${
                        dragOver
                            ? 'border-primary bg-primary/10'
                            : 'border-white/20 bg-background/50 hover:border-primary/60 hover:bg-background/70'
                    }`}
                >
                    <input
                        ref={inputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleInputChange}
                        className="hidden"
                    />
                    {isUploading ? (
                        <div className="flex flex-col items-center gap-2 py-3">
                            <Loader2 className="w-5 h-5 animate-spin text-primary" />
                            <span className="text-xs text-muted-foreground">Compressing & uploading...</span>
                        </div>
                    ) : value ? (
                        <div className="flex flex-col items-center gap-1 py-2 px-3 text-center">
                            <ImageIcon className="w-4 h-4 text-primary" />
                            <span className="text-xs text-primary">Image uploaded</span>
                            <span className="text-xs text-muted-foreground">Click to replace</span>
                        </div>
                    ) : (
                        <div className="flex flex-col items-center gap-1 py-3 px-3 text-center">
                            <Upload className="w-5 h-5 text-muted-foreground" />
                            <span className="text-xs text-muted-foreground">
                                <span className="hidden sm:inline">Drop image here or </span>Tap to browse
                            </span>
                            <span className="text-xs text-muted-foreground/60">JPG, PNG, WebP — auto-compressed</span>
                        </div>
                    )}
                </div>
            )}

            {error && (
                <div className="flex items-center gap-1.5 text-red-400 text-xs">
                    <X className="w-3 h-3" />
                    {error}
                </div>
            )}

            {/* Preview */}
            {value && (
                <div className="relative w-20 h-20 rounded-lg overflow-hidden border border-white/10">
                    <LazyImage src={value} alt="Preview" />
                    <button
                        type="button"
                        onClick={() => onChange('')}
                        className="absolute top-0.5 right-0.5 p-0.5 rounded-full bg-black/70 hover:bg-red-500 transition-colors"
                    >
                        <X className="w-3 h-3 text-white" />
                    </button>
                </div>
            )}
        </div>
    )
}
