import { clsx } from "clsx"
import React, { useEffect, useLayoutEffect, useRef, useState, type ReactNode } from "react"

interface TooltipProps {
  trigger?: ReactNode
  defaultOpen?: boolean
  children: ReactNode
  className?: string
  position?: "top" | "bottom" | "left" | "right" | "auto"
  on?: "hover" | "click" | string[]


}

const Tooltip: React.FC<TooltipProps> = ({
  trigger,
  children,
  className,
  position = "auto",
  defaultOpen = false,
  on = "hover"
}) => {
  const [isOpen, setIsOpen] = useState(defaultOpen)
  const visible = isOpen

  const [currentPosition, setCurrentPosition] = useState<"top" | "bottom" | "left" | "right">("bottom")
  const [offset, setOffset] = useState({ x: 0, y: 0 })
  const tooltipRef = useRef<HTMLDivElement>(null)
  const triggerRef = useRef<HTMLDivElement>(null)

  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  const handleMouseEnter = () => {
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current)
      timeoutRef.current = null
    }
    if ((on === "hover" || (Array.isArray(on) && on.includes("hover")))) {
      setIsOpen(true)
    }
  }

  const handleMouseLeave = () => {
    if ((on === "hover" || (Array.isArray(on) && on.includes("hover")))) {
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
    if ((on === "click" || (Array.isArray(on) && on.includes("click")))) {
      setIsOpen(!isOpen)
    }
  }



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

      let offsetX = 0
      let offsetY = 0

      // We need to re-measure or estimate because position change might affect rect
      // For simplicity, we calculate based on the decided newPos relative to trigger
      // This is an approximation as we can't force a reflow cleanly inside the same effect without complexity
      // Better strategy: Calculate theoretical position of Tooltip center

      const triggerCenter = triggerRect.left + triggerRect.width / 2
      const triggerMiddle = triggerRect.top + triggerRect.height / 2

      if (newPos === 'top' || newPos === 'bottom') {
        const tooltipLeft = triggerCenter - tooltipRect.width / 2
        const tooltipRight = triggerCenter + tooltipRect.width / 2

        if (tooltipLeft < 10) {
          offsetX = 10 - tooltipLeft
        } else if (tooltipRight > viewportWidth - 10) {
          offsetX = (viewportWidth - 10) - tooltipRight
        }
      } else {
        // left or right
        const tooltipTop = triggerMiddle - tooltipRect.height / 2
        const tooltipBottom = triggerMiddle + tooltipRect.height / 2

        if (tooltipTop < 10) {
          offsetY = 10 - tooltipTop
        } else if (tooltipBottom > viewportHeight - 10) {
          offsetY = (viewportHeight - 10) - tooltipBottom
        }
      }

      setOffset({ x: offsetX, y: offsetY })
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
        return "left-1/2 -translate-x-1/2 -bottom-[6px] border-t-[6px] border-t-surface border-x-transparent border-b-0 border-x-[6px]"
      case "bottom":
        return "left-1/2 -translate-x-1/2 -top-[6px] border-b-[6px] border-b-surface border-x-transparent border-t-0 border-x-[6px]"
      case "left":
        return "top-1/2 -translate-y-1/2 -right-[6px] border-l-[6px] border-l-surface border-y-transparent border-r-0 border-y-[6px]"
      case "right":
        return "top-1/2 -translate-y-1/2 -left-[6px] border-r-[6px] border-r-surface border-y-transparent border-l-0 border-y-[6px]"
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
        <>
          <div
            ref={tooltipRef}
            className={clsx(
              "select-none",
              "absolute z-50 p-5 rounded shadow-md w-[300px]",
              "bg-surface text-text-primary",
              "transition-opacity duration-300 pointer-events-auto",
              getPositionClasses()
            )}
            style={{
              marginLeft: offset.x,
              marginTop: offset.y
            }}
            onMouseDown={(e) => {
              e.stopPropagation()
              e.preventDefault() // Prevent selection clearing
            }}
            onMouseUp={(e) => e.stopPropagation()}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="text-[13px] font-normal select-auto">
              {children}
            </div>
            {/* Arrow */}
            <div className={clsx(
              "absolute w-0 h-0",
              getArrowClasses()
            )}
              style={{
                marginLeft: -offset.x,
                marginTop: -offset.y
              }}
            ></div>
          </div>
        </>
      )}
    </div>
  )
}

export default Tooltip
