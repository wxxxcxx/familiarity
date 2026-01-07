import { clsx } from "clsx"
import React from 'react'
import { useSettings } from "../utils/settings"

const WordLabel = ({
  text,
  data
}: {
  text: string
  data: {
    code: number
    definitions: string[]
    message: string | null
  }
}) => {
  const [settings] = useSettings()

  if (!settings) return <>{text}</>

  const getDecorationClass = () => {
    switch (settings.highlightStyle) {
      case "wavy":
        return "decoration-wavy"
      case "solid":
        return "decoration-solid"
      case "dotted":
        return "decoration-dotted"
      case "dashed":
        return "decoration-dashed"
      case "none":
        return "decoration-none"
      default:
        return "decoration-wavy"
    }
  }

  return (
    <span
      className={clsx(
        "relative cursor-pointer overflow-visible mb-1",
        "underline decoration-auto underline-offset-2",
        getDecorationClass()
      )}
      style={{
        textDecorationColor: settings.highlightColor
      }}
    >
      {text}
      {data &&
        data.definitions != null &&
        data.definitions.length > 0 &&
        settings.showTranslation && (
          <span
            className={clsx(
              "absolute -top-[0.6em] left-0 w-full rounded-sm z-[999]",
              "text-[0.6em] leading-[1em] select-none",
              "overflow-hidden whitespace-nowrap block",
              "select-none"
            )}
            style={{
              backgroundColor: settings.translationBgColor,
              color: settings.translationTextColor
            }}
          >
            <span className="inline-block relative animate-text-swing-scroll px-1">
              {data.definitions[0]}
            </span>
          </span>
        )}
    </span>
  )
}

export default WordLabel
