"use client";

import { useSession } from "next-auth/react";
import { usePathname } from "next/navigation";

export default function Header() {
  const pathname = usePathname();
  const pathSegments = pathname.split("/").filter((segment) => segment);

  const { data: session } = useSession();

  return (
    <header className="p-4 bg-white border-b flex border-slate-200">
  
      <div className="w-64">Business Name</div>

      <div className="flex flex-1 justify-between items-center text-gray-600 text-sm">
        {/* Breadcrumbs */}
        <div className="flex items-center space-x-2">
          <span>|</span>
          {pathSegments.map((segment, index) => {
            const isLast = index === pathSegments.length - 1;
            return (
              <div key={index} className="flex items-center space-x-2">
                {index !== 0 && <span>|</span>}
                <span
                  className={
                    isLast ? "font-semibold text-gray-800" : "text-gray-500"
                  }
                >
                  {segment.charAt(0).toUpperCase() + segment.slice(1)}
                </span>
              </div>
            );
          })}
        </div>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <span className="text-gray-800 font-medium">{session?.user?.name || "Loading..."}</span>
          <img
            src="https://i.pravatar.cc/40"
            alt="User Avatar"
            className="w-8 h-8 rounded-full border border-gray-300"
          />
        </div>
      </div>
    </header>
  );
}
