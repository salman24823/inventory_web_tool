"use client";

import React from "react";
import { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { User, LogOut, X, Factory, ChartNoAxesColumn } from "lucide-react"; // Assuming you're using Lucide icons
import { Home } from "lucide-react";
import { Button } from "@heroui/react";
import Header from "../components/header/page";
import { Box } from "lucide-react";
import { HandCoinsIcon } from "lucide-react";
import { Activity } from "lucide-react";
import { HandCoins } from "lucide-react";
import { signOut } from "next-auth/react";
import { toast } from "react-toastify";
import { Album } from "lucide-react";

const Layout = ({ children }) => {
  const pathname = usePathname();

  // State for controlling the sidebar visibility
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const routes = [
    {
      name: "Dashboard",
      path: "/dashboard",
      icon: <Home className="w-5 h-5 text-gray-600" />,
    },
    {
      name: "Customers History",
      path: "/dashboard/customers",
      icon: <User className="w-5 h-5 text-gray-600" />,
    },
    {
      name: "Employees",
      path: "/dashboard/employees",
      icon: <User className="w-5 h-5 text-gray-600" />,
    },
    {
      name: "Stock",
      path: "/dashboard/inventory",
      icon: <Box className="w-5 h-5 text-gray-600" />,
    },
    {
      name: "Sales",
      path: "/dashboard/orders",
      icon: <Album className="w-5 h-5 text-gray-600" />,
    },
    // {
    //   name: "Sales",
    //   path: "/dashboard/sales",
    //   icon: <Activity className="w-5 h-5 text-gray-600" />,
    // },
    {
      name: "Spending",
      path: "/dashboard/spendings",
      icon: <HandCoins className="w-5 h-5 text-gray-600" />,
    },
    {
      name: "Factory",
      path: "/dashboard/factory",
      icon: <Factory  className="w-5 h-5 text-gray-600" />,
    },
    {
      name: "PO #",
      path: "/dashboard/PO",
      icon: <ChartNoAxesColumn  className="w-5 h-5 text-gray-600" />,
    },
  ];

  const logout = async() => {

    try {
      toast.success("Signed out successfully.");
      await signOut();
      location.replace("/"); // Redirect to home page
    } catch (error) {
      toast.error("Error signing out. Please try again.");
      console.error("Logout Error:", error);
    }

  };

  return (
    <>
      <Header />

      <div className="min-h-screen bg-offwhite flex">
        {/* Sidebar */}
        {pathname !== "/panel/change-password" && (
          <>
            {/* Overlay for mobile */}
            {sidebarOpen && (
              <div
                className="fixed inset-0 bg-black/50 lg:hidden z-20"
                onClick={() => setSidebarOpen(false)}
              />
            )}

            <aside className={`top-0 fixed flex flex-col pt-2 lg:sticky lg:top-0 lg:left-0 lg:h-screen lg:w-[15%] w-[15%] h-full bg-white border-r border-gray-200 z-30 transform transition-transform duration-300 ease-in-out ${
                sidebarOpen ? "translate-x-0" : "-translate-x-full"
              } lg:translate-x-0`}
            >
              <ul>
                {/* Close button for mobile */}
                <li
                  className="lg:hidden w-full p-4 border-b border-gray-200 flex justify-end"
                  onClick={() => setSidebarOpen(false)}
                >
                  <X className="w-5 h-5 text-gray-600 cursor-pointer hover:text-blue-500" />
                </li>

                {/* Navigation Links */}
                {routes.map((route) => (
                  <li key={route.path}>
                    <Button
                      className="p-0 w-full bg-white hover:bg-gray-50 transition-all duration-300 ease-in-out"
                      radius="none"
                      onPress={route.onClick} // Attach the onClick handler here
                    >
                      <Link
                        href={route.path}
                        className={`flex items-center gap-3 p-3 w-full text-medium font-semibold ${
                          pathname === route.path
                            ? "font-semibold text-blue-600 bg-blue-50 border-r-4 border-blue-500"
                            : "text-gray-600 hover:text-blue-500"
                        }`}
                      >
                        {route.icon}
                        {route.name}
                      </Link>
                    </Button>
                  </li>
                ))}

                {/* Logout Button */}
                <li>
                  <Button
                    className="w-full bg-white text-medium font-semibold text-gray-600 flex justify-start p-3 hover:bg-gray-50 hover:text-blue-500 transition-all duration-300 ease-in-out"
                    radius="none"
                    onPress={logout}
                  >
                    <LogOut className="w-5 h-5 mr-3" />
                    Logout
                  </Button>
                </li>
              </ul>

                {/* pending logic. */}
              <div className="p-3 relative w-full flex items-end flex-1">


                <div className="w-full h-2/3 border border-slate-300 rounded-xl bg-slate-50">
                  
                </div>


              </div>

            </aside>
          </>
        )}

        {/* Main Content */}
        <div className="lg:w-[85%] w-[85%] p-4 bg-gray-50 min-h-screen">
          {/* Mobile Menu Toggle Button */}
          <Button
            className="lg:hidden p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 mb-4"
            onPress={() => setSidebarOpen(!sidebarOpen)}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-6 w-6"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M4 6h16M4 12h16m-7 6h7"
              />
            </svg>
          </Button>

          {/* Page Content */}
          {children}
        </div>

      </div>

    </>
  );
};

export default Layout;
