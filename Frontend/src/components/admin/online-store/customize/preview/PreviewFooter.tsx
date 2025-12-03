"use client";

import {
  Mail,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Twitter,
  Linkedin,
} from "lucide-react";
import type {
  ThemeColors,
  ThemeTypography,
  FooterConfig,
  ButtonStyle,
} from "@/lib/types/Theme";
import { getButtonRadius } from "@/lib/utils/ThemeHelper";

interface PreviewFooterProps {
  colors: ThemeColors;
  typography: ThemeTypography;
  footer: FooterConfig;
  buttonStyle: ButtonStyle;
  viewMode: "desktop" | "tablet" | "mobile";
}

export function PreviewFooter({
  colors,
  typography,
  footer,
  buttonStyle,
  viewMode,
}: PreviewFooterProps) {
  return (
    <footer
      id="contact"
      className="px-6 py-12"
      style={{ backgroundColor: footer.backgroundColor }}
    >
      {/* Footer Links */}
      <div
        className="grid gap-8 mb-12"
        style={{
          gridTemplateColumns: `repeat(${Math.min(
            footer.columns,
            viewMode === "mobile"
              ? 2
              : viewMode === "tablet"
              ? 3
              : footer.columns
          )}, 1fr)`,
        }}
      >
        {Object.entries(footer.columnSettings)
          .slice(0, footer.columns)
          .map(([key, column]) => (
            <div key={key}>
              <h4
                className="font-semibold mb-4"
                style={{
                  fontSize: `${typography.bodySize}px`,
                  color: colors.text,
                }}
              >
                {column.title}
              </h4>
              <ul
                className="space-y-2 text-sm"
                style={{ color: colors.secondary }}
              >
                {column.links.map((link, index) => (
                  <li key={index}>
                    <a
                      href={link.url}
                      className="hover:opacity-70 transition-opacity"
                      style={{ color: colors.secondary }}
                    >
                      {link.label}
                    </a>
                  </li>
                ))}
              </ul>
            </div>
          ))}
      </div>

      {/* Social Media Links */}
      {footer.showSocialIcons && (
        <div className="flex justify-center gap-4 mb-8">
          {footer.socialLinks.facebook && (
            <a
              href={footer.socialLinks.facebook}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Facebook className="w-5 h-5" style={{ color: colors.text }} />
            </a>
          )}
          {footer.socialLinks.instagram && (
            <a
              href={footer.socialLinks.instagram}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Instagram className="w-5 h-5" style={{ color: colors.text }} />
            </a>
          )}
          {footer.socialLinks.twitter && (
            <a
              href={footer.socialLinks.twitter}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Twitter className="w-5 h-5" style={{ color: colors.text }} />
            </a>
          )}
          {footer.socialLinks.linkedin && (
            <a
              href={footer.socialLinks.linkedin}
              className="p-2 rounded-full hover:bg-gray-100 transition-colors"
            >
              <Linkedin className="w-5 h-5" style={{ color: colors.text }} />
            </a>
          )}
        </div>
      )}

      {/* Contact Info */}
      <div
        className="flex flex-col md:flex-row justify-center items-center gap-6 mb-8 pb-8 border-b text-sm"
        style={{ borderColor: colors.secondary, color: colors.secondary }}
      >
        {footer.contactInfo.email && (
          <div className="flex items-center gap-2">
            <Mail className="w-4 h-4" />
            <span>{footer.contactInfo.email}</span>
          </div>
        )}
        {footer.contactInfo.phone && (
          <div className="flex items-center gap-2">
            <Phone className="w-4 h-4" />
            <span>{footer.contactInfo.phone}</span>
          </div>
        )}
        {footer.contactInfo.address && (
          <div className="flex items-center gap-2">
            <MapPin className="w-4 h-4" />
            <span>{footer.contactInfo.address}</span>
          </div>
        )}
      </div>

      {/* Payment Icons & Copyright */}
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        {footer.showPaymentIcons && (
          <div className="flex items-center gap-3">
            <div
              className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold"
              style={{ color: colors.text }}
            >
              VISA
            </div>
            <div
              className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold"
              style={{ color: colors.text }}
            >
              MC
            </div>
            <div
              className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold"
              style={{ color: colors.text }}
            >
              PP
            </div>
            <div
              className="w-10 h-6 bg-gray-200 rounded flex items-center justify-center text-xs font-semibold"
              style={{ color: colors.text }}
            >
              AE
            </div>
          </div>
        )}
        <p className="text-sm" style={{ color: colors.secondary }}>
          {footer.copyrightText}
        </p>
      </div>
    </footer>
  );
}
