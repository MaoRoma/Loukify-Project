"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Switch } from "@/components/ui/switch";
import {
  GripVertical,
  ChevronDown,
  ChevronUp,
  Plus,
  Trash2,
} from "lucide-react";

interface Section {
  id: string;
  type: string;
  name: string;
  subtitle: string;
  enabled: boolean;
  expanded: boolean;
  content: {
    heading?: string;
    subheading?: string;
    description?: string;
    buttonText?: string;
  };
}

interface SectionsTabProps {
  sections: Section[];
  setSections: (sections: Section[]) => void;
}

export function SectionsTab({ sections, setSections }: SectionsTabProps) {
  const toggleSection = (id: string) => {
    setSections(
      sections.map((section) =>
        section.id === id ? { ...section, enabled: !section.enabled } : section
      )
    );
  };

  const toggleExpanded = (id: string) => {
    setSections(
      sections.map((section) =>
        section.id === id
          ? { ...section, expanded: !section.expanded }
          : section
      )
    );
  };

  const updateSectionContent = (id: string, field: string, value: string) => {
    setSections(
      sections.map((section) =>
        section.id === id
          ? { ...section, content: { ...section.content, [field]: value } }
          : section
      )
    );
  };

  const removeSection = (id: string) => {
    setSections(sections.filter((section) => section.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-foreground">Page Sections</h3>
      </div>

      {/* Sections List */}
      <div className="space-y-3">
        {sections.map((section) => (
          <div
            key={section.id}
            className="border border-border rounded-lg bg-card overflow-hidden"
          >
            {/* Section Header */}
            <div className="flex items-center gap-3 p-3">
              <GripVertical className="h-4 w-4 text-muted-foreground cursor-move" />
              <div className="flex-1">
                <div className="font-medium text-sm text-foreground">
                  {section.name}
                </div>
                <div className="text-xs text-muted-foreground">
                  {section.subtitle}
                </div>
              </div>
              <Switch
                checked={section.enabled}
                onCheckedChange={() => toggleSection(section.id)}
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8"
                onClick={() => toggleExpanded(section.id)}
              >
                {section.expanded ? (
                  <ChevronUp className="h-4 w-4" />
                ) : (
                  <ChevronDown className="h-4 w-4" />
                )}
              </Button>
            </div>

            {/* Section Content (Expanded) */}
            {section.expanded && (
              <div className="px-3 pb-3 space-y-4 border-t border-border pt-4">
                {/* Heading */}
                {section.content.heading !== undefined && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Heading
                    </label>
                    <Input
                      value={section.content.heading}
                      onChange={(e) =>
                        updateSectionContent(
                          section.id,
                          "heading",
                          e.target.value
                        )
                      }
                      placeholder="Enter heading"
                      className="bg-muted/50"
                    />
                  </div>
                )}

                {/* Subheading */}
                {section.content.subheading !== undefined && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Subheading
                    </label>
                    <Input
                      value={section.content.subheading}
                      onChange={(e) =>
                        updateSectionContent(
                          section.id,
                          "subheading",
                          e.target.value
                        )
                      }
                      placeholder="Enter subheading"
                      className="bg-muted/50"
                    />
                  </div>
                )}

                {/* Description */}
                {section.content.description !== undefined && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Description
                    </label>
                    <Textarea
                      value={section.content.description}
                      onChange={(e) =>
                        updateSectionContent(
                          section.id,
                          "description",
                          e.target.value
                        )
                      }
                      placeholder="Enter description"
                      className="bg-muted/50 min-h-20"
                    />
                  </div>
                )}

                {/* Button Text */}
                {section.content.buttonText !== undefined && (
                  <div className="space-y-2">
                    <label className="text-sm font-medium text-foreground">
                      Button Text
                    </label>
                    <Input
                      value={section.content.buttonText}
                      onChange={(e) =>
                        updateSectionContent(
                          section.id,
                          "buttonText",
                          e.target.value
                        )
                      }
                      placeholder="Enter button text"
                      className="bg-muted/50"
                    />
                  </div>
                )}

                {/* Remove Button */}
                <Button
                  variant="destructive"
                  className="w-full gap-2"
                  onClick={() => removeSection(section.id)}
                >
                  <Trash2 className="h-4 w-4" />
                  Remove Section
                </Button>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
