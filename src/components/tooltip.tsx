import { clsx } from "clsx"
import React, { useEffect, useRef, useState, type ReactNode } from "react"

interface TooltipProps {
  trigger?: ReactNode
  open?: boolean
  children: ReactNode
  className?: string
  position?: string[] // simplified for compatibility
  on?: "hover" | "click" | string[]
  closeOnDocumentClick?: boolean
  keepTooltipInside?: boolean
  lockScroll?: boolean
}

const Tooltip: React.FC<TooltipProps> = ({
  trigger,
  children,
  open: controlledOpen,
  className,
  on = "hover",
  closeOnDocumentClick = true
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const visible = isControlled ? controlledOpen : isOpen

  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const handleMouseEnter = () => {
    if (!isControlled && (on === "hover" || (Array.isArray(on) && on.includes("hover")))) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isControlled && (on === "hover" || (Array.isArray(on) && on.includes("hover")))) {
      setIsOpen(false)
    }
  }

  const handleClick = (e: React.MouseEvent) => {
    if (!isControlled && (on === "click" || (Array.isArray(on) && on.includes("click")))) {
      setIsOpen(!isOpen)
    }
  }

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        closeOnDocumentClick &&
        visible &&
        tooltipRef.current &&
        !tooltipRef.current.contains(event.target as Node) &&
        triggerRef.current &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        if (!isControlled) setIsOpen(false)
      }
    }

    document.addEventListener("mousedown", handleClickOutside)
    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [visible, closeOnDocumentClick, isControlled])

  return (
    <div
      className={clsx("relative inline-block", className)}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
    >
      {trigger && (
        <div ref={triggerRef} onClick={handleClick} className="inline-block">
          {trigger}
        </div>
      )}

      {visible && (
        <div
          ref={tooltipRef}
          className={clsx(
            "absolute z-50 p-5 rounded shadow-md min-w-[200px] max-w-[500px]",
            "bg-[#eeeeee] text-[#444444] dark:bg-[#444444] dark:text-[#aaaaaa]",
            "transition-opacity duration-300",
            "left-1/2 -translate-x-1/2 mt-2", // Default to bottom center
            // Additional positioning logic could be added here based on `position` prop
          )}
          style={{ top: "100%" }}
        >
          <div className="text-[13px] font-normal">
            {children}
          </div>
          {/* Arrow (simplified) */}
          <div className={clsx(
            "absolute w-0 h-0 border-l-[6px] border-l-transparent border-r-[6px] border-r-transparent border-b-[6px]",
            "border-b-[#eeeeee] dark:border-b-[#444444]",
            "left-1/2 -translate-x-1/2 -top-[6px]"
          )}></div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
