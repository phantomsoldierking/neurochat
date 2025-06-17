"use client"

import React from "react"
import { Chat } from "stream-chat-react"
import { useThemeStore } from "../store/useThemeStore"

const StreamChatWrapper = ({ client, children }) => {
  const { theme } = useThemeStore()

  // Custom CSS variables for Stream components based on DaisyUI theme
  const getStreamThemeVars = () => {
    const root = document.documentElement
    const computedStyle = getComputedStyle(root)

    return {
      "--str-chat__primary-color": computedStyle.getPropertyValue("--p") || "#570df8",
      "--str-chat__active-primary-color": computedStyle.getPropertyValue("--pf") || "#4506cb",
      "--str-chat__surface-color": computedStyle.getPropertyValue("--b1") || "#ffffff",
      "--str-chat__secondary-surface-color": computedStyle.getPropertyValue("--b2") || "#f2f2f2",
      "--str-chat__primary-surface-color": computedStyle.getPropertyValue("--b3") || "#e5e6e6",
      "--str-chat__primary-surface-color-low-emphasis": computedStyle.getPropertyValue("--bc") || "#1f2937",
      "--str-chat__border-radius-circle": "0.5rem",
      "--str-chat__border-radius-md": "0.375rem",
      "--str-chat__border-radius-sm": "0.25rem",
      "--str-chat__spacing-px": "1px",
      "--str-chat__spacing-xs": "0.25rem",
      "--str-chat__spacing-sm": "0.5rem",
      "--str-chat__spacing-md": "1rem",
      "--str-chat__spacing-lg": "1.5rem",
      "--str-chat__spacing-xl": "2rem",
      "--str-chat__text-color": computedStyle.getPropertyValue("--bc") || "#1f2937",
      "--str-chat__text-color-secondary": computedStyle.getPropertyValue("--bc") + "80" || "#6b7280",
      "--str-chat__background-color": computedStyle.getPropertyValue("--b1") || "#ffffff",
      "--str-chat__message-bubble-color": computedStyle.getPropertyValue("--n") || "#2a323c",
      "--str-chat__own-message-bubble-color": computedStyle.getPropertyValue("--p") || "#570df8",
    }
  }

  React.useEffect(() => {
    const themeVars = getStreamThemeVars()
    const root = document.documentElement

    Object.entries(themeVars).forEach(([property, value]) => {
      root.style.setProperty(property, value)
    })
  }, [theme])

  return (
    <div className="stream-chat-wrapper" data-theme={theme}>
      <Chat client={client} theme="messaging light">
        {children}
      </Chat>
    </div>
  )
}

export default StreamChatWrapper
