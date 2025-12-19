"use client";

import type React from "react";

import { useState, useEffect } from "react";
import { Save } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { api } from "@/lib/api/config";
import { useAuth } from "@/lib/context/AuthContext";

export function ProfileSetting() {
  const { user } = useAuth();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    storeName: "",
  });

  const [currentSettingId, setCurrentSettingId] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  // Initialize form data from user auth data
  useEffect(() => {
    if (user) {
      const fullName = user.user_metadata?.full_name || "";
      const email = user.email || "";
      
      setFormData({
        fullName,
        email,
        storeName: "",
      });
    }
  }, [user]);

  // Fetch store settings on mount
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
          setFormData((prev) => ({
            ...prev,
            storeName: settings.store_name || "",
          }));
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

  const handleSave = async () => {
    setError(null);
    setSuccess(false);
    setIsSaving(true);

    try {
      if (!user) {
        throw new Error("User not authenticated");
      }

      // Update user metadata with full name
      const { supabase } = await import('@/lib/supabase/client');
      const { error: updateError } = await supabase.auth.updateUser({
        data: {
          full_name: formData.fullName,
        },
      });

      if (updateError) {
        throw new Error(updateError.message || "Failed to update profile");
      }

      // Split full name into first and last name for backend compatibility
      const nameParts = formData.fullName.trim().split(/\s+/);
      const firstName = nameParts[0] || "User";
      const lastName = nameParts.slice(1).join(" ") || "Name";

      // Prepare settings data
      const settingsData = {
        first_name: firstName,
        last_name: lastName,
        email_address: formData.email,
        store_name: formData.storeName,
      };

      if (currentSettingId) {
        // Update existing settings
        await api.settings.update(currentSettingId, settingsData);
      } else {
        // Create new settings (backend requires first_name, last_name, email_address, store_name)
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
            <Label htmlFor="fullName" className="text-sm font-medium">
              Full Name
            </Label>
            <Input
              id="fullName"
              value={formData.fullName}
              onChange={(e) => handleChange("fullName", e.target.value)}
              className="bg-muted/50"
              placeholder="Enter your full name"
            />
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium">
              Email Address
            </Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              disabled
              className="bg-muted/50 cursor-not-allowed opacity-60"
            />
            <p className="text-xs text-muted-foreground">
              Email cannot be changed
            </p>
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
              placeholder="Enter your store name"
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
