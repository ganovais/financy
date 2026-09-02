import type { ComponentProps, CSSProperties } from "react"
import { Toaster as Sonner } from "sonner"

const toasterStyle = {
  "--normal-bg": "var(--color-white)",
  "--normal-border": "var(--color-gray-200)",
  "--normal-text": "var(--color-gray-800)",
  "--success-bg": "var(--color-green-light)",
  "--success-border": "var(--color-green-base)",
  "--success-text": "var(--color-green-dark)",
  "--error-bg": "var(--color-red-light)",
  "--error-border": "var(--color-red-base)",
  "--error-text": "var(--color-red-dark)",
  "--info-bg": "var(--color-blue-light)",
  "--info-border": "var(--color-blue-base)",
  "--info-text": "var(--color-blue-dark)",
  "--border-radius": "0.75rem",
} as CSSProperties

function Toaster(props: ComponentProps<typeof Sonner>) {
  return (
    <Sonner
      position="top-right"
      richColors
      closeButton
      className="!font-sans"
      style={toasterStyle}
      {...props}
    />
  )
}

export { Toaster }
