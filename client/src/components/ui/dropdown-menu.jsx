"use client"

import * as React from "react"
import { cn } from "@/lib/utils"

const DropdownMenu = ({ children }) => {
  const [open, setOpen] = React.useState(false)

  return (
    <div className="relative inline-block text-left">
      {React.Children.map(children, (child) => React.cloneElement(child, { open, setOpen }))}
    </div>
  )
}

const DropdownMenuTrigger = ({ children, open, setOpen, className, ...props }) => {
  return (
    <button className={cn("inline-flex items-center", className)} onClick={() => setOpen(!open)} {...props}>
      {children}
    </button>
  )
}

const DropdownMenuContent = ({ children, open, setOpen, className, ...props }) => {
  const ref = React.useRef()

  React.useEffect(() => {
    const handleClickOutside = (event) => {
      if (ref.current && !ref.current.contains(event.target)) {
        setOpen(false)
      }
    }

    if (open) {
      document.addEventListener("mousedown", handleClickOutside)
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside)
    }
  }, [open, setOpen])

  if (!open) return null

  return (
    <div
      ref={ref}
      className={cn(
        "absolute right-0 mt-2 w-56 origin-top-right rounded-md shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none z-50",
        className,
      )}
      {...props}
    >
      <div className="py-1">{children}</div>
    </div>
  )
}

const DropdownMenuItem = React.forwardRef(({ className, asChild, ...props }, ref) => {
  if (asChild) {
    return React.cloneElement(props.children, {
      className: cn("block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-gray-900", className),
      ref,
      ...props,
    })
  }

  return (
    <button
      className={cn("block px-4 py-2 text-sm w-full text-left hover:bg-gray-100 hover:text-gray-900", className)}
      ref={ref}
      {...props}
    />
  )
})
DropdownMenuItem.displayName = "DropdownMenuItem"

export { DropdownMenu, DropdownMenuTrigger, DropdownMenuContent, DropdownMenuItem }
