import { clsx } from "clsx"
import React, { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"

interface TooltipProps {
  trigger?: ReactNode
  open?: boolean
  children: ReactNode
  className?: string
  position?: "top" | "bottom" | "left" | "right" | "auto"
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
  position = "auto",
  on = "hover",
  closeOnDocumentClick = true
}) => {
  const [isOpen, setIsOpen] = useState(false)
  const isControlled = controlledOpen !== undefined
  const visible = isControlled ? controlledOpen : isOpen

  const [currentPosition, setCurrentPosition] = useState<"top" | "bottom" | "left" | "right">("bottom")
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if (!isControlled && (on === "hover" || (Array.isArray(on) && on.includes("hover")))) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if (!isControlled && (on === "hover" || (Array.isArray(on) && on.includes("hover")))) {
      timeoutRef.current = setTimeout(() => {
        setIsOpen(false)
      }, 200)
    }
  }

  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }
  }, [])

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

  useLayoutEffect(() => {
    if (visible && tooltipRef.current && triggerRef.current) {
      if (position !== "auto") {
        setCurrentPosition(position)
        return
      }

      const tooltipRect = tooltipRef.current.getBoundingClientRect()
      const triggerRect = triggerRef.current.getBoundingClientRect()
      const viewportHeight = window.innerHeight
      const viewportWidth = window.innerWidth

      // Default bottom
      let newPos: "top" | "bottom" | "left" | "right" = "bottom"

      const spaceBottom = viewportHeight - triggerRect.bottom
      const spaceTop = triggerRect.top
      const spaceRight = viewportWidth - triggerRect.right
      const spaceLeft = triggerRect.left

      const requiredHeight = tooltipRect.height + 10 // + margin
      const requiredWidth = tooltipRect.width + 10

      if (spaceBottom < requiredHeight) {
        // Not enough space below
        if (spaceTop >= requiredHeight) {
          newPos = "top"
        } else if (spaceRight >= requiredWidth) {
          newPos = "right"
        } else if (spaceLeft >= requiredWidth) {
          newPos = "left"
        } else {
          // Fallback to wherever has most space or default top/bottom
          newPos = spaceTop > spaceBottom ? "top" : "bottom"
        }
      }

      setCurrentPosition(newPos)
    }
  }, [visible, position, children])

  const getPositionClasses = () => {
    switch (currentPosition) {
      case "top":
        return "bottom-full left-1/2 -translate-x-1/2 mb-2"
      case "bottom":
        return "top-full left-1/2 -translate-x-1/2 mt-2"
      case "left":
        return "right-full top-1/2 -translate-y-1/2 mr-2"
      case "right":
        return "left-full top-1/2 -translate-y-1/2 ml-2"
      default:
        return "top-full left-1/2 -translate-x-1/2 mt-2"
    }
  }

  const getArrowClasses = () => {
    switch (currentPosition) {
      case "top":
        return "left-1/2 -translate-x-1/2 -bottom-[6px] border-t-[6px] border-t-[#eeeeee] dark:border-t-[#444444] border-x-transparent border-b-0 border-x-[6px]"
      case "bottom":
        return "left-1/2 -translate-x-1/2 -top-[6px] border-b-[6px] border-b-[#eeeeee] dark:border-b-[#444444] border-x-transparent border-t-0 border-x-[6px]"
      case "left":
        return "top-1/2 -translate-y-1/2 -right-[6px] border-l-[6px] border-l-[#eeeeee] dark:border-l-[#444444] border-y-transparent border-r-0 border-y-[6px]"
      case "right":
        return "top-1/2 -translate-y-1/2 -left-[6px] border-r-[6px] border-r-[#eeeeee] dark:border-r-[#444444] border-y-transparent border-l-0 border-y-[6px]"
      default:
        return ""
    }
  }

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
            "transition-opacity duration-300 pointer-events-auto",
            getPositionClasses()
          )}
          onMouseDown={(e) => {
            e.stopPropagation()
            e.preventDefault() // Prevent selection clearing
          }}
          onMouseUp={(e) => e.stopPropagation()}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="text-[13px] font-normal">
            {children}
          </div>
          {/* Arrow */}
          <div className={clsx(
            "absolute w-0 h-0",
            getArrowClasses()
          )}></div>
        </div>
      )}
    </div>
  )
}

export default Tooltip
