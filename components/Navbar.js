// components/Navbar.jsx
"use client";

import { useState, useRef, useEffect } from "react";
import Link from "next/link";
import Image from "next/image";
import { useAuth } from "@/app/providers/AuthProvider";
import { usePathname } from "next/navigation";
import { Bell, Menu, X } from "lucide-react";

export default function Navbar() {
  const { user, logout } = useAuth();
  const path = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const [avatarMenuOpen, setAvatarMenuOpen] = useState(false);
  const avatarRef = useRef(null);

  // Close avatar dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event) {
      if (avatarRef.current && !avatarRef.current.contains(event.target)) {
        setAvatarMenuOpen(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const linkClass = (href) =>
    `block px-4 py-2 rounded-md ${
      path === href
        ? "text-white bg-gray-900"
        : "text-gray-700 hover:bg-gray-100"
    }`;

  return (
    <nav className="sticky top-0 z-50 bg-white border-b border-gray-200">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Left: Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link href="/">
              <div className="flex items-center">
                {/* Replace with your logo image or text */}
                <p className="font-serif font-bold text-3xl tracking-wide text-gray-700">
                  GRAY<span className="text-4xl">.</span>
                </p>
                {/* <Image
                  src="/logo.svg"
                  alt="Logo"
                  width={120}
                  height={32}
                  priority
                /> */}
              </div>
            </Link>
          </div>

          {/* Center / desktop menu (hidden on small) */}
          <div className="hidden sm:flex sm:space-x-4 sm:items-center">
            {user && (
              <>
                <Link href="/feed">
                  <p className={linkClass("/feed")}>Feed</p>
                </Link>
                <Link href="/editor">
                  <p className={linkClass("/editor")}>Write</p>
                </Link>
              </>
            )}
          </div>

          {/* Right side */}
          <div className="flex items-center">
            {!user ? (
              <div className="hidden sm:flex sm:space-x-3">
                <Link href="/login">
                  <p className="px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Sign In
                  </p>
                </Link>
                <Link href="/register">
                  <p className="px-3 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-700">
                    Get Started
                  </p>
                </Link>
              </div>
            ) : (
              <div className="flex items-center relative justify-center gap-5" ref={avatarRef}>
                <div className="relative">
                <Bell />
                <div className="absolute rounded-full"></div>
                </div>
                <button
                  onClick={() => setAvatarMenuOpen((o) => !o)}
                  className="flex items-center text-sm rounded-full focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-500"
                >
                  {user.image ? (
                    <Image
                      src={user.image}
                      alt={user.username}
                      width={40}
                      height={40}
                      className="w-10 h-10 rounded-full object-cover"
                    />
                  ) : (
                    <div className="w-8 h-8 bg-gray-300 rounded-full flex items-center justify-center text-gray-900">
                      {user.username?.[0]?.toUpperCase() || "U"}
                    </div>
                  )}
                </button>
                {avatarMenuOpen && (
                  <div className="origin-top-right absolute right-0 mt-2 top-8 w-48 rounded-md shadow-lg bg-white ring-1 ring-gray-400 ring-opacity-2">
                    <div className="py-1">
                      <Link href={`/profile/${user.username}`}>
                        <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Your Profile
                        </p>
                      </Link>
                      <Link href="/settings">
                        <p className="block px-4 py-2 text-gray-700 hover:bg-gray-100">
                          Settings
                        </p>
                      </Link>
                      <button
                        onClick={() => {
                          setAvatarMenuOpen(false);
                          logout();
                        }}
                        className="w-full text-left px-4 py-2 text-gray-700 hover:bg-gray-100"
                      >
                        Logout
                      </button>
                    </div>
                  </div>
                )}
              </div>
            )}

            {/* Mobile menu button */}
            <div className="sm:hidden ml-2">
              <button
                onClick={() => setMobileOpen((o) => !o)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-700 hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-inset focus:ring-gray-500"
              >
                {mobileOpen ? (
                  <X className="block h-6 w-6" />
                ) : (
                  <Menu className="block h-6 w-6" />
                )}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile menu, show/hide based on state */}
      {mobileOpen && (
        <div className="sm:hidden">
          <div className="pt-2 pb-3 space-y-1">
            <Link href="/">
              <p className={linkClass("/")}>Home</p>
            </Link>
            {user && (
              <>
                <Link href="/feed">
                  <p className={linkClass("/feed")}>Feed</p>
                </Link>
                <Link href="/editor">
                  <p className={linkClass("/editor")}>Write</p>
                </Link>
              </>
            )}
            {!user ? (
              <>
                <Link href="/login">
                  <p className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Sign In
                  </p>
                </Link>
                <Link href="/register">
                  <p className="block px-4 py-2 rounded-md bg-gray-900 text-white hover:bg-gray-700">
                    Get Started
                  </p>
                </Link>
              </>
            ) : (
              <>
                <Link href={`/profile/${user.username}`}>
                  <p className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Your Profile
                  </p>
                </Link>
                <Link href="/settings">
                  <p className="block px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100">
                    Settings
                  </p>
                </Link>
                <button
                  onClick={() => {
                    setMobileOpen(false);
                    logout();
                  }}
                  className="w-full text-left px-4 py-2 rounded-md text-gray-700 hover:bg-gray-100"
                >
                  Logout
                </button>
              </>
            )}
          </div>
        </div>
      )}
    </nav>
  );
}
