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
}

const StoreSetting = () => {
  const [settings, setSettings] = useState<StoreSettings>({
    store_name: "",
    store_description: "",
    store_url: "",
  });
  const [isLoading, setIsLoading] = useState(false);
  const [isSaving, setIsSaving] = useState(false);

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
          setSettings(data.data[0]);
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
    </div>
  );
};

export default StoreSetting;
