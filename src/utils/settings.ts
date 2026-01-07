import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const STORAGE_KEY = "extension_settings"

export interface Settings {
    showTranslation: boolean
    highlightStyle: "wavy" | "solid" | "dotted" | "dashed" | "none"
    theme: "light" | "dark" | "auto"
    highlightColor: string
    translationBgColor: string
    translationTextColor: string
}

export const defaultSettings: Settings = {
    showTranslation: true,
    highlightStyle: "wavy",
    theme: "auto",
    highlightColor: "#3b82f6",
    translationBgColor: "#3b82f6",
    translationTextColor: "#ffffff"
}

export const storage = new Storage()

export const useSettings = () => {
    return useStorage<Settings>(STORAGE_KEY, defaultSettings)
}
