"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Users, Car, Zap } from "lucide-react";

export function AdminNav() {
  const pathname = usePathname();

  const tabs = [
    { name: "Users", href: "/admin", icon: Users, exact: true },
    { name: "Vehicles", href: "/admin/vehicles", icon: Car, exact: false },
    { name: "Sessions", href: "/admin/sessions", icon: Zap, exact: false },
  ];

  return (
    <div className="flex items-center gap-2 mb-6 bg-white dark:bg-neutral-900/40 p-1.5 rounded-2xl border border-neutral-200 dark:border-neutral-800 shadow-sm overflow-x-auto">
      {tabs.map((tab) => {
        const isActive = tab.exact ? pathname === tab.href : pathname.startsWith(tab.href);
        const Icon = tab.icon;
        
        return (
          <Link
            key={tab.name}
            href={tab.href}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-bold transition-all whitespace-nowrap flex-1 justify-center sm:flex-none sm:justify-start ${
              isActive
                ? "bg-neutral-900 dark:bg-white text-white dark:text-neutral-900 shadow-md"
                : "text-neutral-500 hover:text-neutral-900 dark:hover:text-white hover:bg-neutral-100 dark:hover:bg-neutral-800"
            }`}
          >
            <Icon className="w-4 h-4" />
            {tab.name}
          </Link>
        );
      })}
    </div>
  );
}
