import { clsx } from "clsx"
import React from 'react'

class Label extends React.Component<{
  text: string
  data: {
    code: number
    definitions: string[]
    message: string | null
  }
}> {
  render(): React.ReactNode {
    return (
      <span
        className={clsx(
          "relative cursor-pointer overflow-visible mb-1",
          "underline decoration-wavy decoration-[rgb(57,136,255)] decoration-auto underline-offset-2"
        )}
      >
        {this.props.text}
        {this.props.data &&
          this.props.data.definitions != null &&
          this.props.data.definitions.length > 0 && (
            <span
              className={clsx(
                "absolute -top-[0.6em] left-0 w-full h-[1em] z-[999]",
                "text-[0.7em] leading-[1em] text-[#f97878] select-none",
                "overflow-hidden whitespace-nowrap text-ellipsis"
              )}
            >
              {this.props.data.definitions[0]}
            </span>
          )}
      </span>
    )
  }
}

export default Label
