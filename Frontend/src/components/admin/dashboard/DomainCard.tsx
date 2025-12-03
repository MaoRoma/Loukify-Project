"use client";

import { useEffect, useState } from "react";
import { ExternalLink, Loader2, Copy } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { api } from "@/lib/api/config";

export function DomainCard() {
  const [subdomain, setSubdomain] = useState("");
  const [storeUrl, setStoreUrl] = useState("");
  const [isPublished, setIsPublished] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [copySuccess, setCopySuccess] = useState(false);
  const [hasStore, setHasStore] = useState(false);

  useEffect(() => {
    const fetchStoreTemplate = async () => {
      try {
        setIsLoading(true);
        const response = await api.storeTemplates.get();
        if (response?.data) {
          setHasStore(true);
          const template = response.data;
          if (template.store_subdomain) {
            const url = `https://${template.store_subdomain}.loukify.com`;
            setStoreUrl(url);
            setSubdomain(template.store_subdomain);
          } else {
            setSubdomain("");
            setStoreUrl("");
          }
          setIsPublished(template.is_published);
        } else {
          setHasStore(false);
        }
      } catch (err: any) {
        console.error("Failed to fetch store template:", err);
        setError(err.message || "Failed to load store information.");
      } finally {
        setIsLoading(false);
      }
    };

    fetchStoreTemplate();
  }, []);

  const formatSubdomain = (value: string) =>
    value
      ?.toLowerCase()
      .trim()
      .replace(/[^a-z0-9-]+/g, "-")
      .replace(/^-+|-+$/g, "") || "";

  const handlePublish = async () => {
    if (!subdomain) {
      setError("Please enter a subdomain.");
      return;
    }

    try {
      setIsSaving(true);
      setError(null);
      const response = await api.storeTemplates.publish({ store_subdomain: subdomain });
      const url = response?.store_url
        ? `https://${response.store_url}`
        : `https://${subdomain}.loukify.com`;
      setStoreUrl(url);
      setIsPublished(true);
      setCopySuccess(false);
      alert(response?.message || `Store published at ${url}`);
    } catch (err: any) {
      console.error("Failed to activate domain:", err);
      setError(err.message || "Failed to activate domain. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleCopy = async () => {
    if (!storeUrl) return;
    try {
      await navigator.clipboard.writeText(storeUrl);
      setCopySuccess(true);
      setTimeout(() => setCopySuccess(false), 2000);
    } catch (err) {
      console.error("Failed to copy:", err);
    }
  };

  const canPublish = hasStore && subdomain.length > 0;

  return (
    <Card className="rounded-lg bg-card border border-border max-w-md">
      <CardHeader>
        <CardTitle className="text-base font-semibold text-foreground">
          Customize your domain
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-3">
        {isLoading ? (
          <div className="flex items-center justify-center py-6">
            <Loader2 className="w-6 h-6 animate-spin text-muted-foreground" />
          </div>
        ) : (
          <>
            {!hasStore && (
              <p className="text-sm text-muted-foreground">
                Publish your store from the Online Store &gt; Customize page to generate your unique domain link.
              </p>
            )}

            {hasStore && (
              <>
                <div className="space-y-2">
                  <label className="text-xs font-medium text-muted-foreground">
                    Store subdomain
                  </label>
                  <div className="relative">
                    <Input
                      type="text"
                      value={subdomain}
                      onChange={(e) => setSubdomain(formatSubdomain(e.target.value))}
                      placeholder="yourstore"
                      className="pr-28"
                    />
                    <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-muted-foreground">
                      .loukify.com
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">
                    This is the link customers will use to visit your store.
                  </p>
                </div>

                {storeUrl && (
                  <div className="flex items-center gap-2 text-sm">
                    <Button
                      variant="secondary"
                      size="sm"
                      className="flex-1"
                      onClick={handleCopy}
                    >
                      {copySuccess ? "Copied!" : "Copy link"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => window.open(storeUrl, "_blank")}
                    >
                      <ExternalLink className="w-4 h-4" />
                    </Button>
                  </div>
                )}
              </>
            )}

            {error && <p className="text-xs text-destructive">{error}</p>}

            <Button
              variant="outline"
              className="w-full bg-background border-border"
              onClick={handlePublish}
              disabled={!canPublish || isSaving}
            >
              {isSaving ? (
                <>
                  <Loader2 className="w-4 h-4 mr-2 animate-spin" />
                  Activating...
                </>
              ) : isPublished ? (
                "Update domain"
              ) : (
                "Activate"
              )}
            </Button>
          </>
        )}
      </CardContent>
    </Card>
  );
}
