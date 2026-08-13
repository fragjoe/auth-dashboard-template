"use client"

import * as React from "react"
import { useFilter } from "react-aria"
import { ChevronDown, Check, X } from "lucide-react"

import { cn } from "@/lib/utils"

interface ComboboxProps {
  options: { value: string; label: string }[]
  value: string
  onValueChange: (value: string) => void
  placeholder?: string
  disabled?: boolean
  className?: string
  required?: boolean
  error?: string
}

export function Combobox({
  options,
  value,
  onValueChange,
  placeholder = "Pilih...",
  disabled = false,
  className,
  required = false,
  error,
}: ComboboxProps) {
  let { contains } = useFilter({ sensitivity: "base" })
  let [isOpen, setIsOpen] = React.useState(false)
  let [inputValue, setInputValue] = React.useState(
    options.find((o) => o.value === value)?.label || ""
  )

  // Sync external value changes
  React.useEffect(() => {
    const selectedOption = options.find((o) => o.value === value)
    setInputValue(selectedOption?.label || "")
  }, [value, options])

  const selectedOption = options.find((o) => o.value === value)

  const filteredOptions = options.filter((option) =>
    contains(option.label, inputValue) || inputValue === ""
  )

  return (
    <div className={cn("space-y-1", className)}>
      <div className="relative">
        <div className="relative flex items-center">
          <input
            className={cn(
              "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
              error && "border-red-500 focus:ring-red-500",
              selectedOption && "pr-8"
            )}
            value={inputValue}
            onChange={(e) => {
              setInputValue(e.target.value)
              if (!isOpen) setIsOpen(true)
            }}
            onFocus={() => setIsOpen(true)}
            onBlur={() => setTimeout(() => setIsOpen(false), 200)}
            placeholder={placeholder}
            disabled={disabled}
          />
          {selectedOption ? (
            <button
              type="button"
              className="absolute right-2 top-1/2 -translate-y-1/2 p-1 hover:bg-muted rounded"
              onClick={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onValueChange("")
                setInputValue("")
              }}
            >
              <X className="h-4 w-4 text-muted-foreground" />
            </button>
          ) : (
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
          )}
        </div>

        {/* Dropdown */}
        {isOpen && !disabled && (
          <div className="absolute z-50 mt-1 max-h-60 w-full overflow-auto rounded-md border bg-popover p-1 text-popover-foreground shadow-lg">
            {filteredOptions.length > 0 ? (
              filteredOptions.map((option) => {
                const isSelected = option.value === value

                return (
                  <button
                    key={option.value}
                    type="button"
                    className={cn(
                      "relative flex w-full cursor-pointer select-none items-center rounded-sm py-1.5 px-2 text-sm outline-none hover:bg-accent hover:text-accent-foreground",
                      isSelected && "bg-accent text-accent-foreground"
                    )}
                    onClick={() => {
                      onValueChange(option.value)
                      setInputValue(option.label)
                      setIsOpen(false)
                    }}
                  >
                    <span className="flex-1 text-left">{option.label}</span>
                    {isSelected && (
                      <Check className="h-4 w-4 text-primary mr-1" />
                    )}
                  </button>
                )
              })
            ) : (
              <div className="py-6 text-center text-sm text-muted-foreground">
                Tidak ditemukan
              </div>
            )}
          </div>
        )}
      </div>

      {error && (
        <p className="text-xs text-red-500">{error}</p>
      )}
    </div>
  )
}
