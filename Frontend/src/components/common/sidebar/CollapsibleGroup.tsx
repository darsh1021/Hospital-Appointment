import { useState } from "react"
import { useLocation } from "react-router-dom"
import { cn } from '../../../lib/utils'
import { ChevronDown } from 'lucide-react'
import SidebarLink from "./SidebarLink"

type NavItem = {
    label: string
    to: string
    icon: React.ElementType
    children?: NavItem[]
}

const CollapsibleGroup = ({ item }: { item: NavItem }) => {
    const location = useLocation()
    const isGroupActive = location.pathname.startsWith(item.to)
    const [open, setOpen] = useState(isGroupActive)
    const Icon = item.icon

    return (
        <div>
            <button
                type="button"
                aria-expanded={open}
                onClick={() => setOpen((v) => !v)}
                className={cn(
                    "group flex w-full items-center gap-2.5 rounded-[6px] px-3 py-2 text-[14px] font-normal leading-5 transition-colors",
                    "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white",
                    isGroupActive
                        ? "text-[#171717] dark:text-white"
                        : "text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717] dark:text-[#888888] dark:hover:bg-white/5 dark:hover:text-white"
                )}
            >
                <Icon size={15} aria-hidden="true" className="shrink-0 text-[#888888]" />
                <span className="min-w-0 flex-1 truncate text-left">{item.label}</span>
                <ChevronDown
                    size={13}
                    aria-hidden="true"
                    className={cn("shrink-0 transition-transform duration-200", open && "rotate-180")}
                />
            </button>
            {open && (
                <div className="ml-4 mt-1 flex flex-col gap-0.5 border-l border-[#ebebeb] pl-3 dark:border-white/10">
                    {item.children!.map((child) => (
                        <SidebarLink key={child.to} item={child} />
                    ))}
                </div>
            )}
        </div>
    )
}

export default CollapsibleGroup