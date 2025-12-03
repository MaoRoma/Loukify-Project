export const AVAILABLE_FONTS = [
  { value: "Inter", label: "Inter" },
  { value: "Roboto", label: "Roboto" },
  { value: "Open Sans", label: "Open Sans" },
  { value: "Lato", label: "Lato" },
  { value: "Montserrat", label: "Montserrat" },
  { value: "Poppins", label: "Poppins" },
  { value: "Playfair Display", label: "Playfair Display" },
  { value: "Merriweather", label: "Merriweather" },
  { value: "Raleway", label: "Raleway" },
  { value: "Oswald", label: "Oswald" },
  { value: "Source Sans Pro", label: "Source Sans Pro" },
  { value: "PT Sans", label: "PT Sans" },
  { value: "Nunito", label: "Nunito" },
  { value: "Ubuntu", label: "Ubuntu" },
  { value: "Quicksand", label: "Quicksand" },
] as const

export function getFontFamily(fontName: string): string {
  return `'${fontName}', sans-serif`
}

export function loadGoogleFont(fontName: string): void {
  if (typeof window === "undefined") return

  const fontId = `google-font-${fontName.replace(/\s+/g, "-").toLowerCase()}`

  // Check if font is already loaded
  if (document.getElementById(fontId)) return

  // Create link element for Google Fonts
  const link = document.createElement("link")
  link.id = fontId
  link.rel = "stylesheet"
  link.href = `https://fonts.googleapis.com/css2?family=${fontName.replace(
    /\s+/g,
    "+",
  )}:wght@400;500;600;700&display=swap`

  document.head.appendChild(link)
}
