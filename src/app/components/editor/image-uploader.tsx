"use client"

import type React from "react"

import { useState, useRef } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { ImageIcon, Upload, X } from "lucide-react"

interface ImageUploaderProps {
  onUpload: (file: File) => void
  onCancel: () => void
  maxSizeMB?: number
  acceptedTypes?: string
}

export function ImageUploader({
  onUpload,
  onCancel,
  maxSizeMB = 5,
  acceptedTypes = "image/jpeg, image/png, image/gif, image/webp",
}: ImageUploaderProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [preview, setPreview] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const maxSizeBytes = maxSizeMB * 1024 * 1024

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    validateAndSetFile(file)
  }

  const validateAndSetFile = (file?: File) => {
    setError(null)

    if (!file) {
      return
    }

    // Check file type
    if (!file.type.match(/(image\/jpeg|image\/png|image\/gif|image\/webp)/)) {
      setError("Please select a valid image file (JPEG, PNG, GIF, or WebP)")
      return
    }

    // Check file size
    if (file.size > maxSizeBytes) {
      setError(`File size exceeds ${maxSizeMB}MB limit`)
      return
    }

    setSelectedFile(file)

    // Create preview
    const reader = new FileReader()
    reader.onload = (e) => {
      setPreview(e.target?.result as string)
    }
    reader.readAsDataURL(file)
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    const file = e.dataTransfer.files?.[0]
    validateAndSetFile(file)
  }

  const handleUpload = () => {
    if (selectedFile) {
      onUpload(selectedFile)
    }
  }

  const clearSelection = () => {
    setSelectedFile(null)
    setPreview(null)
    if (fileInputRef.current) {
      fileInputRef.current.value = ""
    }
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-medium">Insert Image</h3>
        <Button variant="ghost" size="icon" onClick={onCancel}>
          <X className="h-4 w-4" />
        </Button>
      </div>

      {!preview ? (
        <div
          className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${
            isDragging ? "border-primary bg-primary/5" : "border-muted-foreground/20 hover:border-primary/50"
          }`}
          onClick={() => fileInputRef.current?.click()}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
        >
          <div className="flex flex-col items-center justify-center gap-2">
            <div className="p-3 rounded-full bg-primary/10">
              <ImageIcon className="h-6 w-6 text-primary" />
            </div>
            <div className="space-y-1">
              <p className="text-sm font-medium">Drag and drop an image, or click to browse</p>
              <p className="text-xs text-muted-foreground">Supports JPEG, PNG, GIF, WebP up to {maxSizeMB}MB</p>
            </div>
          </div>
          <Input ref={fileInputRef} type="file" accept={acceptedTypes} className="hidden" onChange={handleFileChange} />
        </div>
      ) : (
        <div className="relative">
          <img src={preview || "/placeholder.svg"} alt="Preview" className="max-h-64 max-w-full mx-auto rounded-md" />
          <Button variant="destructive" size="icon" className="absolute top-2 right-2" onClick={clearSelection}>
            <X className="h-4 w-4" />
          </Button>
        </div>
      )}

      {error && <p className="text-sm text-destructive">{error}</p>}

      {selectedFile && (
        <div className="space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="font-medium">{selectedFile.name}</span>
            <span className="text-muted-foreground">{(selectedFile.size / 1024 / 1024).toFixed(2)} MB</span>
          </div>
          <div className="space-y-2">
            <Label htmlFor="alt-text">Alt Text (for accessibility)</Label>
            <Input id="alt-text" placeholder="Describe the image..." />
          </div>
        </div>
      )}

      <div className="flex justify-end gap-2">
        <Button variant="outline" onClick={onCancel}>
          Cancel
        </Button>
        <Button onClick={handleUpload} disabled={!selectedFile}>
          <Upload className="h-4 w-4 mr-2" />
          Insert Image
        </Button>
      </div>
    </div>
  )
}
