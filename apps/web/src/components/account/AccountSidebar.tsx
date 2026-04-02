"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface NavItem {
  href: string;
  label: string;
  icon: React.ReactNode;
}

interface AccountSidebarProps {
  title: string;
  items: NavItem[];
}

export function AccountSidebar({ title, items }: AccountSidebarProps) {
  const pathname = usePathname();

  return (
    <aside className="hidden md:block w-64 flex-shrink-0 border-r border-gray-200 pr-8">
      <h2 className="text-xl font-bold text-gray-900 mb-5">{title}</h2>
      <nav className="space-y-0.5">
        {items.map(({ href, label, icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + "/");
          return (
            <Link
              key={href}
              href={href}
              className={[
                "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-colors",
                isActive
                  ? "bg-gray-100 text-gray-900"
                  : "text-gray-800 hover:bg-gray-50",
              ].join(" ")}
            >
              <span className="flex-shrink-0 text-gray-800">{icon}</span>
              {label}
            </Link>
          );
        })}
      </nav>
    </aside>
  );
}
