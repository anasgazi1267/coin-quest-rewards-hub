
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Tabs, TabsList, TabsContent, TabsTrigger } from '@/components/ui/tabs';
import { Image, Trash2, Copy, ExternalLink } from 'lucide-react';
import NavSidebar from '@/components/admin/NavSidebar';
import ImageUploader from '@/components/admin/ImageUploader';
import { toast } from '@/lib/toast';
import { getImages, deleteImage } from '@/lib/images';

const AdminMedia: React.FC = () => {
  const [images, setImages] = useState<string[]>(getImages());
  const [selectedTab, setSelectedTab] = useState<string>('upload');
  const [selectedImage, setSelectedImage] = useState<string | null>(null);
  
  const handleImageDeleted = (imageUrl: string) => {
    deleteImage(imageUrl);
    setImages(getImages());
    toast.success('Image deleted successfully');
    if (selectedImage === imageUrl) {
      setSelectedImage(null);
    }
  };
  
  const handleCopyUrl = (imageUrl: string) => {
    navigator.clipboard.writeText(imageUrl);
    toast.success('Image URL copied to clipboard');
  };
  
  const handleImageUploaded = () => {
    setImages(getImages());
  };
  
  return (
    <div className="flex h-screen bg-background">
      <NavSidebar />
      
      <div className="flex-1 overflow-auto">
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-6">Media Library</h1>
          
          <Tabs defaultValue="upload" value={selectedTab} onValueChange={setSelectedTab}>
            <TabsList className="mb-6">
              <TabsTrigger value="upload">Upload Images</TabsTrigger>
              <TabsTrigger value="library">Image Library</TabsTrigger>
            </TabsList>
            
            <TabsContent value="upload">
              <Card>
                <CardHeader>
                  <CardTitle>Upload New Image</CardTitle>
                </CardHeader>
                <CardContent>
                  <ImageUploader onImageUploaded={handleImageUploaded} />
                </CardContent>
              </Card>
            </TabsContent>
            
            <TabsContent value="library">
              <Card>
                <CardHeader>
                  <CardTitle>Image Library</CardTitle>
                </CardHeader>
                <CardContent>
                  {images.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                      {images.map((imageUrl, index) => (
                        <div 
                          key={index} 
                          className={`relative group rounded-md border overflow-hidden hover:shadow-md transition-all ${
                            selectedImage === imageUrl ? 'ring-2 ring-primary' : ''
                          }`}
                          onClick={() => setSelectedImage(imageUrl === selectedImage ? null : imageUrl)}
                        >
                          <img 
                            src={imageUrl} 
                            alt={`Uploaded image ${index}`} 
                            className="aspect-square w-full object-cover" 
                          />
                          <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                            <div className="flex gap-2">
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="bg-white/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleCopyUrl(imageUrl);
                                }}
                              >
                                <Copy className="h-4 w-4 text-white" />
                              </Button>
                              <Button 
                                size="icon" 
                                variant="ghost" 
                                className="bg-white/20"
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleImageDeleted(imageUrl);
                                }}
                              >
                                <Trash2 className="h-4 w-4 text-white" />
                              </Button>
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12">
                      <div className="w-16 h-16 bg-muted rounded-full flex items-center justify-center mx-auto mb-4">
                        <Image className="h-8 w-8 text-muted-foreground" />
                      </div>
                      <h3 className="text-lg font-medium">No images uploaded yet</h3>
                      <p className="text-muted-foreground mt-1 mb-4">
                        Upload images to start building your library
                      </p>
                      <Button onClick={() => setSelectedTab('upload')}>
                        Upload Images
                      </Button>
                    </div>
                  )}
                  
                  {selectedImage && (
                    <div className="mt-6 p-4 bg-muted rounded-md">
                      <div className="flex flex-col sm:flex-row gap-4">
                        <div className="w-full sm:w-40 h-40">
                          <img 
                            src={selectedImage} 
                            alt="Selected image" 
                            className="w-full h-full object-cover rounded-md" 
                          />
                        </div>
                        <div className="flex-1">
                          <h3 className="font-medium mb-2">Image Details</h3>
                          
                          <div className="space-y-2">
                            <div>
                              <Label className="text-sm text-muted-foreground">Image URL</Label>
                              <div className="flex mt-1">
                                <input 
                                  type="text" 
                                  readOnly 
                                  value={selectedImage} 
                                  className="flex-1 text-xs p-2 bg-background border rounded-l-md"
                                />
                                <Button
                                  size="sm"
                                  variant="secondary"
                                  className="rounded-l-none"
                                  onClick={() => handleCopyUrl(selectedImage)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                            
                            <div className="flex gap-2 mt-4">
                              <Button
                                size="sm"
                                variant="outline"
                                onClick={() => window.open(selectedImage, '_blank')}
                              >
                                <ExternalLink className="h-4 w-4 mr-2" /> 
                                Open
                              </Button>
                              <Button
                                size="sm"
                                variant="destructive"
                                onClick={() => handleImageDeleted(selectedImage)}
                              >
                                <Trash2 className="h-4 w-4 mr-2" /> 
                                Delete
                              </Button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminMedia;
