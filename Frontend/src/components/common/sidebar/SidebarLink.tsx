import { NavLink, useLocation } from "react-router-dom"
import CollapsibleGroup from "./CollapsibleGroup"
import { cn } from '../../../lib/utils'
// import { useEffect, useState } from "react"


type NavItem = {
    label: string
    to: string
    icon: React.ElementType
    children?: NavItem[]
}


const SidebarLink = ({ item }: { item: NavItem }) => {

    const location = useLocation()

    const isDashboard = item.to === "/dashboard/admin" || item.to === '/dashboard/doctor' || '/dashboard/reception' || '/dashboard/patient'

    let isActive = isDashboard ?
        location.pathname === item.to : (location.pathname === item.to || location.pathname.startsWith(item.to + "/"))

    const Icon = item.icon

    if (item.children?.length) {
        return <CollapsibleGroup item={item} />
    }

    return (
        <NavLink
            to={item.to}
            end
            className={cn(
                "group flex items-center gap-2.5 rounded-[6px] px-3 py-2 text-[14px] font-normal leading-5 transition-colors",
                "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#171717] dark:focus-visible:ring-white",
                isActive
                    ? "bg-[#fafafa] text-[#171717] font-medium border border-[#ebebeb] dark:bg-white/5 dark:border-white/10 dark:text-white"
                    : "text-[#4d4d4d] hover:bg-[#fafafa] hover:text-[#171717] dark:text-[#888888] dark:hover:bg-white/5 dark:hover:text-white"
            )}
        >
            {/* Active indicator bar */}
            {isActive && (
                <span
                    className="absolute left-0 h-5 w-0.5 rounded-r-full bg-[#171717] dark:bg-white"
                    aria-hidden="true"
                />
            )}
            <Icon
                size={15}
                aria-hidden="true"
                className={cn(
                    "shrink-0 transition-colors",
                    isActive
                        ? "text-[#171717] dark:text-white"
                        : "text-[#888888] group-hover:text-[#171717] dark:group-hover:text-white"
                )}
            />
            <span className="min-w-0 truncate">{item.label}</span>
        </NavLink>
    )
}

export default SidebarLink