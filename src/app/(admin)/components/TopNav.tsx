"use client";

import React, { useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  Bell,
  Briefcase,
  ChevronDown,
  Clock3,
  Home,
  Languages,
  Settings,
  UserCircle,
  Users,
} from "lucide-react";
import { BiSitemap } from "react-icons/bi";
import { signOut, useSession } from "next-auth/react";
import { motion, AnimatePresence } from "framer-motion";

export const TopNav = () => {
  const [open, setOpen] = useState(false);
  const { data: session } = useSession();
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Trang chủ", icon: Home },
    { href: "/employees", label: "Nhân sự", icon: Users },
    { href: "/timekeeping", label: "Chấm công", icon: Clock3 },
    { href: "/positions", label: "Vị trí", icon: Briefcase },
    { href: "/departments", label: "Phòng", icon: BiSitemap },
    { href: "/settings", label: "Cài đặt", icon: Settings },
  ];

  return (
      <div className="sticky top-0 z-20 w-full rounded-b-2xl bg-[#26272b] text-white">
        <div className="mx-auto max-w-7xl px-4">
          <div className="flex h-16 items-center justify-between">
            {/* Logo + Menu */}
            <div className="flex items-center gap-3">
              <Link
                  href="/"
                  className="flex items-center gap-2 text-white/90 hover:opacity-80 transition"
              >
                <div
                    className="size-8 rounded-xl grid place-items-center font-bold"
                    style={{
                      background: "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)",
                    }}
                >
                  P
                </div>
                <span className="text-lg font-semibold">PeopleHub</span>
              </Link>

              {/* Navigation */}
              <nav className="ml-6 hidden md:flex items-center gap-2">
                {navItems.map((item) => {
                  const isActive = pathname === item.href;
                  return (
                      <Link
                          key={item.href}
                          href={item.href}
                          className={`group relative inline-flex items-center rounded-full px-3 py-1 text-sm transition 
                      ${isActive ? "text-white" : "text-white/90 hover:bg-indigo-500/20"}`}
                          style={
                            isActive
                                ? {
                                  background:
                                      "linear-gradient(to right, #B8C2FF 0%, #6183FF 100%)",
                                }
                                : {}
                          }
                      >
                        <item.icon className="size-5 shrink-0" />
                        <AnimatePresence initial={false}>
                          {(isActive || open) && (
                              <motion.span
                                  initial={{ width: 0, opacity: 0 }}
                                  animate={{ width: "auto", opacity: 1 }}
                                  exit={{ width: 0, opacity: 0 }}
                                  transition={{ duration: 0.25 }}
                                  className="overflow-hidden ml-2 whitespace-nowrap"
                              >
                                {item.label}
                              </motion.span>
                          )}
                        </AnimatePresence>
                      </Link>
                  );
                })}
              </nav>
            </div>

            {/* Right side */}
            <div className="flex items-center gap-3">
              {/* Language */}
              <button className="hidden sm:flex items-center gap-2 rounded-full bg-white/10 px-3 py-1 text-sm hover:bg-white/15">
                <Languages className="size-4" /> English <ChevronDown className="size-4" />
              </button>

              {/* Notifications */}
              <button className="rounded-full bg-white/10 p-2 hover:bg-white/15">
                <Bell className="size-5" />
              </button>

              {/* User avatar + Dropdown */}
              <div
                  className="relative"
                  onMouseEnter={() => setOpen(true)}
                  onMouseLeave={() => setOpen(false)}
              >
                {!session?.user ? (
                    <Link
                        href="/login"
                        className="text-white hover:text-white font-medium px-4 py-1 rounded-lg bg-white/10 hover:bg-white/20 backdrop-blur-md transition"
                    >
                      Đăng nhập
                    </Link>
                ) : (
                    <div className="relative group">
                      <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-md bg-white/10 backdrop-blur-md text-sm font-medium text-white hover:bg-white/20 transition cursor-pointer">
                        <UserCircle className="w-5 h-5 text-white/90" />
                        {session.user.email}
                        <ChevronDown className="size-4" />
                      </div>

                      <div
                          className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg bg-white/10 backdrop-blur-md ring-1 ring-white/20 z-50 transition duration-150 ${
                              open ? "opacity-100 visible" : "opacity-0 invisible"
                          }`}
                      >
                        <Link
                            href="/forgot-password"
                            className="block px-4 py-2 text-sm text-white hover:bg-white/20"
                        >
                          Đổi mật khẩu
                        </Link>
                        <button
                            onClick={() => signOut()}
                            className="w-full text-left px-4 py-2 text-sm text-red-400 hover:bg-white/20"
                        >
                          Đăng xuất
                        </button>
                      </div>
                    </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
  );
};
