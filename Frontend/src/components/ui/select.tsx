import * as React from "react"
import { CheckIcon, ChevronDownIcon } from "lucide-react"
import { cn } from "../../lib/utils"

// ── Context ──────────────────────────────────────────────────────────────────

interface SelectContextValue {
  selectedKey: string | null
  onSelectionChange: (key: string) => void
  isDisabled?: boolean
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  selectedLabel: string
  setSelectedLabel: (label: string) => void
  triggerId: string
}

const SelectContext = React.createContext<SelectContextValue | null>(null)

function useSelectContext() {
  const ctx = React.useContext(SelectContext)
  if (!ctx) throw new Error("Select components must be used inside <Select>")
  return ctx
}

// ── Select (Root) ─────────────────────────────────────────────────────────────

interface SelectProps {
  selectedKey?: string | null
  onSelectionChange?: (key: string) => void
  isDisabled?: boolean
  className?: string
  children?: React.ReactNode
}

function Select({
  selectedKey = null,
  onSelectionChange,
  isDisabled,
  className,
  children,
}: SelectProps) {
  const [isOpen, setIsOpen] = React.useState(false)
  const [selectedLabel, setSelectedLabel] = React.useState("")
  const triggerId = React.useId()

  // Close on outside click
  const containerRef = React.useRef<HTMLDivElement>(null)
  React.useEffect(() => {
    if (!isOpen) return
    const handler = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false)
      }
    }
    document.addEventListener("mousedown", handler)
    return () => document.removeEventListener("mousedown", handler)
  }, [isOpen])

  return (
    <SelectContext.Provider
      value={{
        selectedKey,
        onSelectionChange: onSelectionChange ?? (() => {}),
        isDisabled,
        isOpen,
        setIsOpen,
        selectedLabel,
        setSelectedLabel,
        triggerId,
      }}
    >
      <div
        ref={containerRef}
        data-slot="select"
        className={cn("relative w-full", className)}
      >
        {children}
      </div>
    </SelectContext.Provider>
  )
}

// ── SelectGroup ───────────────────────────────────────────────────────────────

function SelectGroup({
  className,
  children,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-group"
      className={cn("scroll-my-1 p-1", className)}
      {...props}
    >
      {children}
    </div>
  )
}

// ── SelectValue ───────────────────────────────────────────────────────────────

type SelectValueRenderProps = {
  selectedText: string
  selectedItems: string[]
  defaultChildren: React.ReactNode
}

interface SelectValueProps {
  className?: string
  children?: React.ReactNode | ((props: SelectValueRenderProps) => React.ReactNode)
}

function SelectValue({ className, children }: SelectValueProps) {
  const { selectedLabel, selectedKey } = useSelectContext()

  const renderProps: SelectValueRenderProps = {
    selectedText: selectedLabel,
    selectedItems: selectedKey ? [selectedKey] : [],
    defaultChildren: selectedLabel ? (
      <span>{selectedLabel}</span>
    ) : null,
  }

  return (
    <span
      data-slot="select-value"
      className={cn(
        "flex flex-1 text-left",
        !selectedLabel && "text-muted-foreground",
        className
      )}
    >
      {typeof children === "function" ? children(renderProps) : (selectedLabel || children)}
    </span>
  )
}

// ── SelectTrigger ─────────────────────────────────────────────────────────────

interface SelectTriggerProps extends React.ComponentProps<"button"> {
  size?: "sm" | "default"
}

function SelectTrigger({
  className,
  size = "default",
  children,
  ...props
}: SelectTriggerProps) {
  const { isOpen, setIsOpen, isDisabled, triggerId } = useSelectContext()

  return (
    <button
      id={triggerId}
      type="button"
      data-slot="select-trigger"
      data-size={size}
      disabled={isDisabled}
      aria-haspopup="listbox"
      aria-expanded={isOpen}
      onClick={() => !isDisabled && setIsOpen(!isOpen)}
      className={cn(
        "flex w-full items-center justify-between gap-1.5 rounded-lg border border-input bg-transparent py-2 pr-2 pl-2.5 text-sm whitespace-nowrap transition-colors outline-none select-none",
        "focus-visible:border-ring focus-visible:ring-3 focus-visible:ring-ring/50",
        "disabled:cursor-not-allowed disabled:opacity-50",
        "data-[size=default]:h-8 data-[size=sm]:h-7",
        className
      )}
      {...props}
    >
      {children}
      <ChevronDownIcon
        className={cn(
          "pointer-events-none size-4 text-muted-foreground transition-transform duration-200",
          isOpen && "rotate-180"
        )}
      />
    </button>
  )
}

// ── SelectPopover ─────────────────────────────────────────────────────────────

interface SelectPopoverProps {
  className?: string
  children?: React.ReactNode
}

function SelectPopover({ className, children }: SelectPopoverProps) {
  const { isOpen } = useSelectContext()

  if (!isOpen) return null

  return (
    <div
      data-slot="select-content"
      className={cn(
        "absolute z-50 mt-1 w-full min-w-36 overflow-hidden rounded-lg bg-popover text-popover-foreground shadow-md ring-1 ring-foreground/10",
        "animate-in fade-in-0 zoom-in-95",
        className
      )}
    >
      {children}
    </div>
  )
}

// ── SelectContent ─────────────────────────────────────────────────────────────

function SelectContent({ className, children }: SelectPopoverProps) {
  return (
    <SelectPopover className={className}>
      <SelectList>{children}</SelectList>
    </SelectPopover>
  )
}

// ── SelectList ────────────────────────────────────────────────────────────────

function SelectList({
  className,
  children,
}: {
  className?: string
  children?: React.ReactNode
}) {
  return (
    <div
      role="listbox"
      data-slot="select-list"
      className={cn("max-h-60 overflow-x-hidden overflow-y-auto p-0 outline-hidden", className)}
    >
      {children}
    </div>
  )
}

// ── SelectItem ────────────────────────────────────────────────────────────────

interface SelectItemProps {
  id: string
  className?: string
  children?: React.ReactNode
}

function SelectItem({ id, className, children }: SelectItemProps) {
  const { selectedKey, onSelectionChange, setIsOpen, setSelectedLabel } =
    useSelectContext()

  const isSelected = selectedKey === id
  const label = typeof children === "string" ? children : ""

  const handleSelect = () => {
    onSelectionChange(id)
    setSelectedLabel(label)
    setIsOpen(false)
  }

  return (
    <div
      role="option"
      aria-selected={isSelected}
      data-slot="select-item"
      onClick={handleSelect}
      onKeyDown={(e) => (e.key === "Enter" || e.key === " ") && handleSelect()}
      tabIndex={0}
      className={cn(
        "relative flex w-full cursor-pointer items-center gap-1.5 rounded-md py-1.5 pr-8 pl-2 text-sm outline-none select-none transition-colors duration-100",
        "hover:bg-[#e5e7eb] focus-visible:bg-[#e5e7eb]",
        "dark:hover:bg-[#27272a] dark:focus-visible:bg-[#27272a]",
        isSelected && "bg-[#d1d5db] dark:bg-[#3f3f46]",
        className
      )}
    >
      <span className="flex flex-1 whitespace-nowrap">{children}</span>
      <span className="pointer-events-none absolute right-2 flex size-4 items-center justify-center">
        {isSelected && <CheckIcon className="size-4" />}
      </span>
    </div>
  )
}

// ── SelectSeparator ───────────────────────────────────────────────────────────

function SelectSeparator({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-separator"
      className={cn("pointer-events-none -mx-1 my-1 h-px bg-border", className)}
      {...props}
    />
  )
}

// ── SelectLabel ───────────────────────────────────────────────────────────────

function SelectLabel({
  className,
  ...props
}: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-label"
      className={cn("px-2 py-1 text-xs text-muted-foreground", className)}
      {...props}
    />
  )
}

// ── SelectEmpty ───────────────────────────────────────────────────────────────

function SelectEmpty({ className, ...props }: React.ComponentProps<"div">) {
  return (
    <div
      data-slot="select-empty"
      className={cn(
        "w-full py-2 text-center text-sm text-muted-foreground",
        className
      )}
      {...props}
    />
  )
}

// ── Exports ───────────────────────────────────────────────────────────────────

export {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectList,
  SelectPopover,
  SelectSeparator,
  SelectTrigger,
  SelectValue,
  SelectEmpty,
}
