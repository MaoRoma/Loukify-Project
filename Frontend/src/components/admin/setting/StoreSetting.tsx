"use client";
import React, { useState, useEffect } from "react";
import { ShoppingBag, Store, User, InfoIcon } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Save } from "lucide-react";
import {
  InputGroup,
  InputGroupAddon,
  InputGroupButton,
  InputGroupInput,
  InputGroupText,
} from "@/components/ui/input-group";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface StoreSettings {
  id?: string;
  store_name: string;
  store_description: string;
  store_url: string;
  first_name?: string;
  last_name?: string;
  email_address?: string;
  phone_number?: string;
  payment_method_image?: string;
}

const StoreSetting = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "",
    store_description: "",
    store_url: "",
    payment_method_image: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imagePreview, setImagePreview] = useState<string | null>(null);

  // Fetch store settings on component mount
  useEffect(() => {
    fetchStoreSettings();
  }, []);

  const fetchStoreSettings = async () => {
    try {
      setIsLoading(true);
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success && data.data.length > 0) {
          const fetchedSettings = data.data[0];
          setSettings(fetchedSettings);
          if (fetchedSettings.payment_method_image) {
            setImagePreview(fetchedSettings.payment_method_image);
          }
        }
      }
    } catch (error) {
      console.error('Error fetching store settings:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleInputChange = (field: keyof StoreSettings, value: string) => {
    setSettings(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleSaveChanges = async () => {
    try {
      setIsSaving(true);
      
      // Use the dedicated store endpoint for better handling
      const url = `${process.env.NEXT_PUBLIC_API_URL}/api/settings/store`;

      const response = await fetch(url, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          store_name: settings.store_name,
          store_description: settings.store_description,
          store_url: settings.store_url,
          payment_method_image: settings.payment_method_image,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
          alert(data.message || 'Store settings saved successfully!');
        }
      } else {
        const error = await response.json();
        if (response.status === 404) {
          // Settings don't exist yet, create them
          await createInitialSettings();
        } else {
          alert(`Error: ${error.error || 'Failed to save settings'}`);
        }
      }
    } catch (error) {
      console.error('Error saving store settings:', error);
      alert('Error saving store settings');
    } finally {
      setIsSaving(false);
    }
  };

  const createInitialSettings = async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL}/api/settings`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          first_name: 'Store',
          last_name: 'Owner',
          email_address: 'store@example.com',
          store_name: settings.store_name,
          store_description: settings.store_description,
          store_url: settings.store_url,
          payment_method_image: settings.payment_method_image,
        }),
      });

      if (response.ok) {
        const data = await response.json();
        if (data.success) {
          setSettings(data.data);
          alert('Store settings created and saved successfully!');
        }
      } else {
        const error = await response.json();
        alert(`Error: ${error.error || 'Failed to create settings'}`);
      }
    } catch (error) {
      console.error('Error creating store settings:', error);
      alert('Error creating store settings');
    }
  };

  const handleImageUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!file.type.startsWith('image/')) {
      alert('Please upload an image file');
      return;
    }

    // Validate file size (10MB limit)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (file.size > maxSize) {
      alert('Image must be less than 10MB');
      return;
    }

    try {
      setUploadingImage(true);

      // Create FormData
      const formData = new FormData();
      formData.append('image', file);

      // Get auth token from Supabase session (same as product image upload)
      const { supabase } = await import('@/lib/supabase/client');
      const {
        data: { session },
      } = await supabase.auth.getSession();
      const token = session?.access_token;

      if (!token) {
        alert('Please log in again to upload images.');
        return;
      }

      // Upload image
      const uploadResponse = await fetch('/api/storage/upload-image', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
        body: formData,
      });

      if (!uploadResponse.ok) {
        const errorData = await uploadResponse.json();
        throw new Error(errorData.message || 'Failed to upload image');
      }

      const uploadData = await uploadResponse.json();
      if (uploadData.success && uploadData.data?.publicUrl) {
        const imageUrl = uploadData.data.publicUrl;
        setSettings(prev => ({ ...prev, payment_method_image: imageUrl }));
        setImagePreview(imageUrl);
      } else {
        throw new Error('Failed to get image URL');
      }
    } catch (error: any) {
      console.error('Error uploading image:', error);
      alert(error.message || 'Failed to upload image. Please try again.');
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = () => {
    setSettings(prev => ({ ...prev, payment_method_image: "" }));
    setImagePreview(null);
  };
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Store Information
          </h2>
          <p className="text-sm text-muted-foreground">
            Configure your store details and business information
          </p>
        </div>
      </div>
      {isLoading ? (
        <div className="flex items-center justify-center py-8">
          <p className="text-muted-foreground">Loading store settings...</p>
        </div>
      ) : (
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="storeName" className="text-sm font-medium">
                Store Name
              </Label>
              <Input 
                id="storeName" 
                type="text" 
                className="bg-muted/50" 
                value={settings.store_name}
                onChange={(e) => handleInputChange('store_name', e.target.value)}
                placeholder="Enter your store name"
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label htmlFor="storedescription" className="text-sm font-medium">
              Store Description
            </Label>
            <Input 
              id="storedescription" 
              type="text" 
              className="bg-muted/50"
              value={settings.store_description}
              onChange={(e) => handleInputChange('store_description', e.target.value)}
              placeholder="Describe your store"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="storeurl" className="text-sm font-medium">
              Store URL
            </Label>
            <InputGroup className="bg-muted/50">
              <InputGroupInput 
                placeholder="your-store-name" 
                className="pl-1!"
                value={settings.store_url}
                onChange={(e) => handleInputChange('store_url', e.target.value)}
              />
              <InputGroupAddon>
                <InputGroupText>https://</InputGroupText>
              </InputGroupAddon>
              <InputGroupAddon align="inline-end">
                <Tooltip>
                  <TooltipTrigger asChild>
                    <InputGroupButton className="rounded-full" size="icon-xs">
                      <InfoIcon />
                    </InputGroupButton>
                  </TooltipTrigger>
                  <TooltipContent>This will be your public store URL</TooltipContent>
                </Tooltip>
              </InputGroupAddon>
            </InputGroup>
          </div>
          <Button 
            className="bg-primary hover:bg-primary/90"
            onClick={handleSaveChanges}
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? 'Saving...' : 'Save Changes'}
          </Button>
        </div>
      )}

      {/* Payment Method Section */}
      <div className="bg-card rounded-lg border border-border p-6 mt-6">
        <div className="flex items-start gap-3 mb-6">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Payment Method
            </h2>
            <p className="text-sm text-muted-foreground">
              Upload your payment QR code or image (e.g., ABA Bank QR code). This will be displayed to customers at checkout.
            </p>
          </div>
        </div>

        <div className="space-y-4">
          {imagePreview ? (
            <div className="space-y-4">
              <div className="relative w-full max-w-md">
                <img
                  src={imagePreview}
                  alt="Payment Method"
                  className="w-full h-auto border border-border rounded-lg"
                />
                <button
                  type="button"
                  onClick={handleRemoveImage}
                  className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 hover:bg-red-600 transition-colors"
                  title="Remove image"
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-5 w-5"
                    viewBox="0 0 20 20"
                    fill="currentColor"
                  >
                    <path
                      fillRule="evenodd"
                      d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </svg>
                </button>
              </div>
              <div className="text-sm text-muted-foreground">
                Click "Upload New Image" below to replace this image.
              </div>
            </div>
          ) : (
            <div className="border-2 border-dashed border-border rounded-lg p-8 text-center">
              <p className="text-muted-foreground mb-4">
                No payment method image uploaded yet
              </p>
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="paymentImage" className="text-sm font-medium">
              {imagePreview ? 'Upload New Image' : 'Upload Payment Method Image'}
            </Label>
            <Input
              id="paymentImage"
              type="file"
              accept="image/*"
              onChange={handleImageUpload}
              disabled={uploadingImage}
              className="bg-muted/50"
            />
            {uploadingImage && (
              <p className="text-sm text-muted-foreground">Uploading image...</p>
            )}
            <p className="text-xs text-muted-foreground">
              Supported formats: JPG, PNG, GIF. Max size: 10MB
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default StoreSetting;
