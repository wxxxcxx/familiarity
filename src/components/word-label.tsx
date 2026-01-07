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
        "underline decoration-[rgb(57,136,255)] decoration-auto underline-offset-2",
        getDecorationClass()
      )}
    >
      {text}
      {data &&
        data.definitions != null &&
        data.definitions.length > 0 &&
        settings.showTranslation && (
          <span
            className={clsx(
              "absolute -top-[0.6em] left-0 w-full h-[1em] z-[999]",
              "text-[0.7em] leading-[1em] text-[#f97878] select-none",
              "overflow-hidden whitespace-nowrap text-ellipsis"
            )}
          >
            {data.definitions[0]}
          </span>
        )}
    </span>
  )
}

export default WordLabel
