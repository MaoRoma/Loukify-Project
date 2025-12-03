"use client";

import type React from "react";

import { useState, useRef, useEffect } from "react";
import { User, Save, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { api } from "@/lib/api/config";

export function ProfileSetting() {
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    storeName: "",
    storeDescription: "",
    storeUrl: "",
  });

  const [currentSettingId, setCurrentSettingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Fetch settings on mount
  useEffect(() => {
    const fetchSettings = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const response = await api.settings.get();
        const settings = Array.isArray(response.data) && response.data.length > 0 
          ? response.data[0] 
          : null;

        if (settings) {
          setCurrentSettingId(settings.id);
          setFormData({
            firstName: settings.first_name || "",
            lastName: settings.last_name || "",
            email: settings.email_address || "",
            phone: settings.phone_number || "",
            storeName: settings.store_name || "",
            storeDescription: settings.store_description || "",
            storeUrl: settings.store_url || "",
          });
        }
      } catch (err: any) {
        console.error("Failed to fetch settings:", err);
        setError(err.message || "Failed to load settings");
      } finally {
        setIsLoading(false);
      }
    };

    fetchSettings();
  }, []);

  const handleChange = (field: string, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setSuccess(false);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      // Validate file type
      if (!file.type.startsWith("image/")) {
        alert("Please select an image file");
        return;
      }

      // Validate file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        alert("Image size should be less than 5MB");
        return;
      }

      setImageFile(file);

      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setProfileImage(reader.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleUploadClick = () => {
    fileInputRef.current?.click();
  };

  const getInitials = () => {
    const first = formData.firstName.charAt(0) || "S";
    const last = formData.lastName.charAt(0) || "O";
    return `${first}${last}`;
  };

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    try {
      const settingsData = {
        first_name: formData.firstName,
        last_name: formData.lastName,
        email_address: formData.email,
        phone_number: formData.phone || undefined,
        store_name: formData.storeName,
        store_description: formData.storeDescription || undefined,
        store_url: formData.storeUrl || undefined,
      };

      if (currentSettingId) {
        // Update existing settings
        await api.settings.update(currentSettingId, settingsData);
      } else {
        // Create new settings
        const response = await api.settings.create(settingsData);
        if (response.data?.id) {
          setCurrentSettingId(response.data.id);
        }
      }

      setSuccess(true);
      setTimeout(() => setSuccess(false), 3000);
    } catch (err: any) {
      console.error("Failed to save settings:", err);
      setError(err.message || "Failed to save settings");
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Profile Information
          </h2>
          <p className="text-sm text-muted-foreground">
            Update your personal information and contact details
          </p>
        </div>
      </div>

      {error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded text-red-700 text-sm">
          {error}
        </div>
      )}

      {success && (
        <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded text-green-700 text-sm">
          Settings saved successfully!
        </div>
      )}

      {isLoading ? (
        <div className="py-8 text-center text-muted-foreground">
          Loading settings...
        </div>
      ) : (
        <div className="space-y-4">
        <div className="space-y-2">
          <Label className="text-sm font-medium">Profile Picture</Label>
          <div className="flex items-center gap-4">
            <Avatar className="w-20 h-20">
              <AvatarImage src={profileImage || undefined} alt="Profile" />
              <AvatarFallback className="text-lg bg-primary/10 text-primary">
                {getInitials()}
              </AvatarFallback>
            </Avatar>
            <div className="flex flex-col gap-2">
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={handleUploadClick}
                className="w-fit bg-transparent"
              >
                <Upload className="w-4 h-4 mr-2" />
                Upload Photo
              </Button>
              <p className="text-xs text-muted-foreground">
                JPG, PNG or GIF. Max size 5MB
              </p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">
              First Name
            </Label>
            <Input
              id="firstName"
              value={formData.firstName}
              onChange={(e) => handleChange("firstName", e.target.value)}
              className="bg-muted/50"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">
              Last Name
            </Label>
            <Input
              id="lastName"
              value={formData.lastName}
              onChange={(e) => handleChange("lastName", e.target.value)}
              className="bg-muted/50"
            />
          </div>
        </div>

        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">
            Email Address
          </Label>
          <Input
            id="email"
            type="email"
            value={formData.email}
            onChange={(e) => handleChange("email", e.target.value)}
            className="bg-muted/50"
          />
        </div>

          <div className="space-y-2">
            <Label htmlFor="phone" className="text-sm font-medium">
              Phone Number
            </Label>
            <Input
              id="phone"
              type="tel"
              value={formData.phone}
              onChange={(e) => handleChange("phone", e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeName" className="text-sm font-medium">
              Store Name
            </Label>
            <Input
              id="storeName"
              value={formData.storeName}
              onChange={(e) => handleChange("storeName", e.target.value)}
              className="bg-muted/50"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeDescription" className="text-sm font-medium">
              Store Description
            </Label>
            <Input
              id="storeDescription"
              value={formData.storeDescription}
              onChange={(e) => handleChange("storeDescription", e.target.value)}
              className="bg-muted/50"
              placeholder="Brief description of your store"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="storeUrl" className="text-sm font-medium">
              Store URL
            </Label>
            <Input
              id="storeUrl"
              value={formData.storeUrl}
              onChange={(e) => handleChange("storeUrl", e.target.value)}
              className="bg-muted/50"
              placeholder="https://yourstore.com"
            />
          </div>

          <Button 
            onClick={handleSave} 
            className="bg-primary hover:bg-primary/90"
            disabled={isSaving}
          >
            <Save className="w-4 h-4 mr-2" />
            {isSaving ? "Saving..." : "Save Changes"}
          </Button>
        </div>
      )}
    </div>
  );
}
