"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

interface MobileBackButtonProps {
  locale: string;
}

export function MobileBackButton({ locale }: MobileBackButtonProps) {
  const pathname = usePathname();
  const isRoot = pathname === `/${locale}/account`;

  if (isRoot) return null;

  return (
    <div className="md:hidden flex items-center px-4 py-3 border-b border-gray-100">
      <Link
        href={`/${locale}/account`}
        className="w-9 h-9 rounded-full bg-gray-100 flex items-center justify-center hover:bg-gray-200 transition-colors"
      >
        <svg className="w-5 h-5 text-gray-700" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
          <path strokeLinecap="round" strokeLinejoin="round" d="M15 19l-7-7 7-7" />
        </svg>
      </Link>
    </div>
  );
}
