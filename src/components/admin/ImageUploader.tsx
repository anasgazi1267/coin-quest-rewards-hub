
import React, { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent } from '@/components/ui/card';
import { Upload, X } from 'lucide-react';
import { toast } from '@/lib/toast';
import { saveImage, getImages } from '@/lib/images';

interface ImageUploaderProps {
  onImageUploaded?: (imageUrl: string) => void;
  showGallery?: boolean;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ 
  onImageUploaded,
  showGallery = true
}) => {
  const [isUploading, setIsUploading] = useState(false);
  const [preview, setPreview] = useState<string | null>(null);
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [gallery, setGallery] = useState<string[]>(getImages());

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.includes('image/')) {
      toast.error('Please select an image file');
      return;
    }
    
    setSelectedImage(file);
    const reader = new FileReader();
    reader.onload = () => {
      setPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };

  const handleUpload = async () => {
    if (!selectedImage) {
      toast.error('Please select an image to upload');
      return;
    }
    
    setIsUploading(true);
    
    try {
      // Convert the image to base64 string and save it
      const reader = new FileReader();
      reader.onload = () => {
        const base64Image = reader.result as string;
        const imageUrl = saveImage(base64Image);
        
        setGallery([imageUrl, ...gallery]);
        toast.success('Image uploaded successfully');
        
        if (onImageUploaded) {
          onImageUploaded(imageUrl);
        }
        
        // Reset the form
        setPreview(null);
        setSelectedImage(null);
        if (fileInputRef.current) {
          fileInputRef.current.value = '';
        }
        setIsUploading(false);
      };
      
      reader.readAsDataURL(selectedImage);
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image');
      setIsUploading(false);
    }
  };

  const handleClearPreview = () => {
    setPreview(null);
    setSelectedImage(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSelectFromGallery = (imageUrl: string) => {
    if (onImageUploaded) {
      onImageUploaded(imageUrl);
      toast.success('Image selected from gallery');
    }
  };

  return (
    <div className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="image">Upload Image</Label>
        <div className="flex items-center gap-2">
          <Input
            ref={fileInputRef}
            id="image"
            type="file"
            accept="image/*"
            onChange={handleFileChange}
            className="flex-1"
          />
          <Button 
            type="button" 
            onClick={handleUpload} 
            disabled={!selectedImage || isUploading}
          >
            {isUploading ? 'Uploading...' : <><Upload className="mr-2 h-4 w-4" /> Upload</>}
          </Button>
        </div>
      </div>
      
      {preview && (
        <div className="relative">
          <Button
            type="button"
            variant="ghost"
            size="icon"
            className="absolute top-2 right-2 bg-background/80 z-10"
            onClick={handleClearPreview}
          >
            <X className="h-4 w-4" />
          </Button>
          <img 
            src={preview} 
            alt="Preview" 
            className="max-h-[200px] w-auto rounded-md border" 
          />
        </div>
      )}
      
      {showGallery && gallery.length > 0 && (
        <div className="space-y-2 mt-6">
          <Label>Image Gallery</Label>
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2">
            {gallery.map((imageUrl, index) => (
              <Card 
                key={index} 
                className="cursor-pointer hover:border-primary transition-colors"
                onClick={() => handleSelectFromGallery(imageUrl)}
              >
                <CardContent className="p-2">
                  <img 
                    src={imageUrl} 
                    alt={`Gallery item ${index}`} 
                    className="h-20 w-full object-cover rounded"
                  />
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default ImageUploader;
