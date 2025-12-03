import React from "react";
import { Lock } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";

const SecuritySetting = () => {
  return (
    <div className="bg-card rounded-lg border border-border p-6">
      <div className="flex items-start gap-3 mb-6">
        <div>
          <h2 className="text-lg font-semibold text-foreground">
            Security Settings
          </h2>
          <p className="text-sm text-muted-foreground">
            Manage your account security and privacy
          </p>
        </div>
      </div>
      <div className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="currentPassword" className="text-sm font-medium">
              Current Password
            </Label>
            <Input
              id="currentPassword"
              type="password"
              className="bg-muted/50"
            />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="newPassword" className="text-sm font-medium">
              New Password
            </Label>
            <Input id="newPassword" type="password" className="bg-muted/50" />
          </div>
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-sm font-medium">
              Confirm Password
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              className="bg-muted/50"
            />
          </div>
        </div>
      </div>
    </div>
  );
};

export default SecuritySetting;
