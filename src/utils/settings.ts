import { Storage } from "@plasmohq/storage"
import { useStorage } from "@plasmohq/storage/hook"

export const STORAGE_KEY = "extension_settings"

export interface Settings {
    showTranslation: boolean
    highlightStyle: "wavy" | "solid" | "dotted" | "dashed" | "none"
    theme: "light" | "dark" | "auto"
}

export const defaultSettings: Settings = {
    showTranslation: true,
    highlightStyle: "wavy",
    theme: "auto"
}

export const storage = new Storage()

export const useSettings = () => {
    return useStorage<Settings>(STORAGE_KEY, defaultSettings)
}
