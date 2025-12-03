"use client";

import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { Slider } from "@/components/ui/slider";
import { Button } from "@/components/ui/button";
import { ChevronDown, Trash2, Plus } from "lucide-react";
import { useState } from "react";

interface FooterTabProps {
  footer: {
    columns: number;
    backgroundColor: string;
    columnSettings: {
      column1: { title: string; links: { label: string; url: string }[] };
      column2: { title: string; links: { label: string; url: string }[] };
      column3: { title: string; links: { label: string; url: string }[] };
      column4: { title: string; links: { label: string; url: string }[] };
    };
    showNewsletter: boolean;
    newsletterTitle: string;
    newsletterDescription: string;
    showSocialIcons: boolean;
    socialLinks: {
      facebook: string;
      instagram: string;
      twitter: string;
      linkedin: string;
    };
    contactInfo: {
      email: string;
      phone: string;
      address: string;
    };
    showPaymentIcons: boolean;
    copyrightText: string;
  };
  setFooter: (footer: any) => void;
}

export function FooterTab({ footer, setFooter }: FooterTabProps) {
  const [expandedColumn, setExpandedColumn] = useState<string | null>(null);

  const updateFooter = (key: string, value: any) => {
    setFooter({ ...footer, [key]: value });
  };

  const updateNestedFooter = (parent: string, key: string, value: any) => {
    const parentObject = footer[parent as keyof typeof footer] as any;
    setFooter({
      ...footer,
      [parent]: {
        ...parentObject,
        [key]: value,
      },
    });
  };

  const updateColumnTitle = (columnKey: string, title: string) => {
    setFooter({
      ...footer,
      columnSettings: {
        ...footer.columnSettings,
        [columnKey]: {
          ...footer.columnSettings[
            columnKey as keyof typeof footer.columnSettings
          ],
          title,
        },
      },
    });
  };

  const updateColumnLink = (
    columnKey: string,
    linkIndex: number,
    field: "label" | "url",
    value: string
  ) => {
    const column =
      footer.columnSettings[columnKey as keyof typeof footer.columnSettings];
    const updatedLinks = [...column.links];
    updatedLinks[linkIndex] = { ...updatedLinks[linkIndex], [field]: value };

    setFooter({
      ...footer,
      columnSettings: {
        ...footer.columnSettings,
        [columnKey]: {
          ...column,
          links: updatedLinks,
        },
      },
    });
  };

  const addColumnLink = (columnKey: string) => {
    const column =
      footer.columnSettings[columnKey as keyof typeof footer.columnSettings];
    setFooter({
      ...footer,
      columnSettings: {
        ...footer.columnSettings,
        [columnKey]: {
          ...column,
          links: [...column.links, { label: "", url: "" }],
        },
      },
    });
  };

  const removeColumnLink = (columnKey: string, linkIndex: number) => {
    const column =
      footer.columnSettings[columnKey as keyof typeof footer.columnSettings];
    const updatedLinks = column.links.filter((_, index) => index !== linkIndex);

    setFooter({
      ...footer,
      columnSettings: {
        ...footer.columnSettings,
        [columnKey]: {
          ...column,
          links: updatedLinks,
        },
      },
    });
  };

  return (
    <div className="space-y-6">
      {/* General Settings */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">General Settings</h3>

        <div className="space-y-2">
          <Label className="text-sm font-medium">
            Footer Columns: {footer.columns}
          </Label>
          <Slider
            value={[footer.columns]}
            onValueChange={([value]) => updateFooter("columns", value)}
            min={2}
            max={6}
            step={1}
            className="w-full"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Background Color</Label>
          <div className="flex gap-2">
            <div className="relative">
              <input
                type="color"
                value={footer.backgroundColor}
                onChange={(e) =>
                  updateFooter("backgroundColor", e.target.value)
                }
                className="h-10 w-16 rounded border border-input cursor-pointer"
              />
            </div>
            <Input
              value={footer.backgroundColor}
              onChange={(e) => updateFooter("backgroundColor", e.target.value)}
              className="flex-1"
              placeholder="#ffffff"
            />
          </div>
        </div>
      </div>

      {/* Footer Columns */}
      <div className="space-y-3">
        <h3 className="font-semibold text-foreground">Footer Columns</h3>

        {[
          { key: "column1", defaultTitle: "Shop" },
          { key: "column2", defaultTitle: "About" },
          { key: "column3", defaultTitle: "Customer Service" },
          { key: "column4", defaultTitle: "Follow Us" },
        ].map((column, index) => {
          const columnData =
            footer.columnSettings[
              column.key as keyof typeof footer.columnSettings
            ];
          const isExpanded = expandedColumn === column.key;

          return (
            <div key={column.key} className="space-y-3">
              <button
                onClick={() =>
                  setExpandedColumn(isExpanded ? null : column.key)
                }
                className={`w-full flex items-center justify-between p-3 rounded-lg border transition-colors ${
                  isExpanded
                    ? "border-foreground bg-accent"
                    : "border-input bg-background hover:bg-accent/50"
                }`}
              >
                <span className="text-sm font-medium">
                  Column {index + 1}: {columnData.title}
                </span>
                <ChevronDown
                  className={`h-4 w-4 transition-transform ${
                    isExpanded ? "rotate-180" : ""
                  }`}
                />
              </button>

              {isExpanded && (
                <div className="space-y-4 p-4 border border-input rounded-lg bg-background">
                  <div className="space-y-2">
                    <Label className="text-sm font-medium">Column Title</Label>
                    <Input
                      value={columnData.title}
                      onChange={(e) =>
                        updateColumnTitle(column.key, e.target.value)
                      }
                      placeholder={column.defaultTitle}
                    />
                  </div>

                  <div className="space-y-3">
                    <Label className="text-sm font-medium">Links</Label>

                    {columnData.links.map((link, linkIndex) => (
                      <div key={linkIndex} className="space-y-2">
                        <div className="flex gap-2">
                          <Input
                            value={link.label}
                            onChange={(e) =>
                              updateColumnLink(
                                column.key,
                                linkIndex,
                                "label",
                                e.target.value
                              )
                            }
                            placeholder="Link Label"
                            className="flex-1"
                          />
                          <Button
                            variant="outline"
                            size="icon"
                            onClick={() =>
                              removeColumnLink(column.key, linkIndex)
                            }
                            className="shrink-0 text-destructive hover:text-destructive"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                        <Input
                          value={link.url}
                          onChange={(e) =>
                            updateColumnLink(
                              column.key,
                              linkIndex,
                              "url",
                              e.target.value
                            )
                          }
                          placeholder="/url-path"
                        />
                      </div>
                    ))}

                    <Button
                      variant="outline"
                      onClick={() => addColumnLink(column.key)}
                      className="w-full"
                    >
                      <Plus className="h-4 w-4 mr-2" />
                      Add Link
                    </Button>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Newsletter */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Newsletter</h3>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Show Newsletter Signup</Label>
          <Switch
            checked={footer.showNewsletter}
            onCheckedChange={(checked) =>
              updateFooter("showNewsletter", checked)
            }
          />
        </div>

        {footer.showNewsletter && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Newsletter Title</Label>
              <Input
                value={footer.newsletterTitle}
                onChange={(e) =>
                  updateFooter("newsletterTitle", e.target.value)
                }
                placeholder="Subscribe to our newsletter"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">
                Newsletter Description
              </Label>
              <Input
                value={footer.newsletterDescription}
                onChange={(e) =>
                  updateFooter("newsletterDescription", e.target.value)
                }
                placeholder="Get the latest updates and exclusive offers"
              />
            </div>
          </>
        )}
      </div>

      {/* Social Media Links */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Social Media Links</h3>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Show Social Icons</Label>
          <Switch
            checked={footer.showSocialIcons}
            onCheckedChange={(checked) =>
              updateFooter("showSocialIcons", checked)
            }
          />
        </div>

        {footer.showSocialIcons && (
          <>
            <div className="space-y-2">
              <Label className="text-sm font-medium">Facebook URL</Label>
              <Input
                value={footer.socialLinks.facebook}
                onChange={(e) =>
                  updateNestedFooter("socialLinks", "facebook", e.target.value)
                }
                placeholder="https://facebook.com"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Instagram URL</Label>
              <Input
                value={footer.socialLinks.instagram}
                onChange={(e) =>
                  updateNestedFooter("socialLinks", "instagram", e.target.value)
                }
                placeholder="https://instagram.com"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Twitter URL</Label>
              <Input
                value={footer.socialLinks.twitter}
                onChange={(e) =>
                  updateNestedFooter("socialLinks", "twitter", e.target.value)
                }
                placeholder="https://twitter.com"
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">LinkedIn URL</Label>
              <Input
                value={footer.socialLinks.linkedin}
                onChange={(e) =>
                  updateNestedFooter("socialLinks", "linkedin", e.target.value)
                }
                placeholder="https://linkedin.com"
              />
            </div>
          </>
        )}
      </div>

      {/* Contact Information */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Contact Information</h3>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Email Address</Label>
          <Input
            value={footer.contactInfo.email}
            onChange={(e) =>
              updateNestedFooter("contactInfo", "email", e.target.value)
            }
            placeholder="support@yourstore.com"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Phone Number</Label>
          <Input
            value={footer.contactInfo.phone}
            onChange={(e) =>
              updateNestedFooter("contactInfo", "phone", e.target.value)
            }
            placeholder="+855 12 345 678"
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Address</Label>
          <Input
            value={footer.contactInfo.address}
            onChange={(e) =>
              updateNestedFooter("contactInfo", "address", e.target.value)
            }
            placeholder="Phnom Penh, Cambodia"
          />
        </div>
      </div>

      {/* Additional Options */}
      <div className="space-y-4">
        <h3 className="font-semibold text-foreground">Additional Options</h3>

        <div className="flex items-center justify-between">
          <Label className="text-sm font-medium">Show Payment Icons</Label>
          <Switch
            checked={footer.showPaymentIcons}
            onCheckedChange={(checked) =>
              updateFooter("showPaymentIcons", checked)
            }
          />
        </div>

        <div className="space-y-2">
          <Label className="text-sm font-medium">Copyright Text</Label>
          <Input
            value={footer.copyrightText}
            onChange={(e) => updateFooter("copyrightText", e.target.value)}
            placeholder="© 2025 Your Store. All rights reserved."
          />
        </div>
      </div>
    </div>
  );
}
