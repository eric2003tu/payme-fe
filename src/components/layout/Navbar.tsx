"use client";

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { notificationsClient } from "@/lib/notificationsClient";
import { useState, useEffect } from "react";
import { 
  FaUser, 
  FaSignOutAlt, 
  FaBars, 
  FaTimes, 
  FaHome, 
  FaChartBar,
  FaMoneyBillWave,
  FaCog,
  FaBell,
  FaChevronDown,
  FaGlobe,
  FaShieldAlt
} from "react-icons/fa";

export function Navbar() {
  const { user, isAuthenticated, logout } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [unreadCount, setUnreadCount] = useState<number>(0);

  useEffect(() => {
    let mounted = true;
    let timer: any;
    const fetchUnread = async () => {
      try {
        const list = await notificationsClient.unread();
        if (mounted) setUnreadCount(list?.length || 0);
      } catch {
        // ignore
      }
    };
    fetchUnread();
    timer = setInterval(fetchUnread, 60000);
    return () => { mounted = false; if (timer) clearInterval(timer); };
  }, []);

  // Format name as E.Tuyishime
  const formattedName = user?.firstName && user?.lastName
    ? `${user.firstName[0]}.${user.lastName}`
    : user?.email?.split('@')[0];

  // Get user initials for avatar
  const userInitials = user?.firstName && user?.lastName
    ? `${user.firstName[0]}${user.lastName[0]}`
    : user?.email?.[0]?.toUpperCase() || "U";

  // Get user profile picture
  const userProfilePic = user?.profilePicture || user?.avatarUrl || null;

  // Handle scroll effect
  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (isProfileOpen && !(event.target as Element).closest('.profile-menu')) {
        setIsProfileOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileOpen]);

  const handleLogout = async () => {
    await logout();
    setIsProfileOpen(false); 
    setIsMenuOpen(false);
  };

  const navigationItems = [
    ...(isAuthenticated ? [
      { href: "/dashboard", label: "Dashboard", icon: <FaChartBar className="w-4 h-4" /> },
      { href: "/dashboard/my-loans", label: "Loans", icon: <FaMoneyBillWave className="w-4 h-4" /> },
    ] : []),
    { href: "/about", label: "About", icon: <FaGlobe className="w-4 h-4" /> },
  ];

  const profileMenuItems = [
    { href: "/dashboard/profile", label: "My Profile", icon: <FaUser className="w-4 h-4" /> },
    { href: "/dashboard/notifications", label: "Notifications", icon: <FaBell className="w-4 h-4" /> },
  ];

  return (
    <>
      <header className={`sticky top-0 z-50 transition-all duration-300 ${
        scrolled 
          ? 'bg-white/95 backdrop-blur-xl shadow-lg border-b border-slate-200' 
          : 'bg-white border-b border-slate-100'
      }`}>
        <div className="container mx-auto px-4 lg:px-6">
          <div className="flex h-16 lg:h-20 items-center justify-between">
            {/* Logo Section */}
            <div className="flex items-center gap-2 lg:gap-3">
              <button 
                onClick={() => setIsMenuOpen(!isMenuOpen)}
                className="lg:hidden p-2 rounded-lg hover:bg-slate-100 transition-colors"
                aria-label="Toggle menu"
              >
                {isMenuOpen ? (
                  <FaTimes className="w-5 h-5 text-slate-700" />
                ) : (
                  <FaBars className="w-5 h-5 text-slate-700" />
                )}
              </button>
              
              <Link 
                href="/" 
                className="flex items-center gap-2 lg:gap-3 group"
              >
                <div className="relative">
                  <div className="h-10 w-10 lg:h-12 lg:w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg group-hover:shadow-xl transition-shadow">
                    <span className="text-white font-bold text-lg lg:text-xl">PM</span>
                  </div>
                  <div className="absolute -bottom-1 -right-1 h-3 w-3 lg:h-4 lg:w-4 rounded-full bg-emerald-500 border-2 border-white"></div>
                </div>
                <div className="flex flex-col">
                  <span className="text-lg lg:text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                    PayMeNow
                  </span>
                  <span className="text-xs text-slate-500 hidden lg:block">
                    Smart Lending Platform
                  </span>
                </div>
              </Link>
            </div>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navigationItems.map((item) => (
                <Link
                  key={item.href}
                  href={item.href}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                >
                  {item.icon}
                  {item.label}
                </Link>
              ))}
            </nav>

            {/* Right Side Actions */}
            <div className="flex items-center gap-2 lg:gap-4">
              {isAuthenticated && user ? (
                <>
                  {/* Notifications */}
                  <Link href="/dashboard/notifications"
                    className="p-2 lg:p-2.5 rounded-full hover:bg-slate-100 transition-colors relative"
                    aria-label="Notifications"
                  >
                    <FaBell className="w-5 h-5 text-slate-600" />
                    {unreadCount > 0 && (
                      <span className="absolute -right-1 -top-1 grid h-4 min-w-4 place-items-center rounded-full bg-rose-500 px-1 text-[10px] font-medium text-white">
                        {unreadCount > 99 ? "99+" : unreadCount}
                      </span>
                    )}
                  </Link>

                  {/* Profile Dropdown */}
                  <div className="relative profile-menu">
                    <button
                      onClick={() => setIsProfileOpen(!isProfileOpen)}
                      className="flex items-center gap-2 lg:gap-3 p-1.5 lg:p-2 rounded-xl hover:bg-slate-100 transition-all duration-200 group"
                      aria-label="Profile menu"
                    >
                      <div className="relative">
                        {userProfilePic ? (
                          <img
                            src={userProfilePic}
                            alt="Profile"
                            className="h-9 w-9 lg:h-10 lg:w-10 rounded-full object-cover shadow-md group-hover:shadow-lg transition-shadow"
                          />
                        ) : (
                          <div className="h-9 w-9 lg:h-10 lg:w-10 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold shadow-md group-hover:shadow-lg transition-shadow">
                            {userInitials}
                          </div>
                        )}
                        <div className="absolute -bottom-1 -right-1 h-3 w-3 rounded-full bg-emerald-500 border-2 border-white"></div>
                      </div>
                      <div className="hidden lg:flex flex-col items-start">
                        <span className="text-sm font-semibold text-slate-900">
                          {formattedName}
                        </span>
                        <span className="text-xs text-slate-500">
                          {user?.category || "Member"}
                        </span>
                      </div>
                      <FaChevronDown className={`w-3 h-3 text-slate-500 transition-transform duration-200 ${
                        isProfileOpen ? 'rotate-180' : ''
                      }`} />
                    </button>

                    {/* Profile Dropdown Menu */}
                    {isProfileOpen && (
                      <div className="absolute right-0 mt-2 w-72 lg:w-80 bg-white rounded-xl shadow-2xl border border-slate-200 py-2 animate-in slide-in-from-top-5 fade-in duration-200">
                        {/* User Info Header */}
                        <div className="px-4 py-3 border-b border-slate-100">
                          <div className="flex items-center gap-3">
                            {userProfilePic ? (
                              <img
                                src={userProfilePic}
                                alt="Profile"
                                className="h-12 w-12 rounded-full object-cover"
                              />
                            ) : (
                              <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                                {userInitials}
                              </div>
                            )}
                            <div className="flex-1">
                              <p className="font-semibold text-slate-900">
                                {user?.firstName} {user?.lastName}
                              </p>
                              <p className="text-sm text-slate-500 truncate">{user?.email}</p>
                              <div className="flex items-center gap-2 mt-1">
                                <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                                  user?.category === 'EXCELLENT' 
                                    ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                                    : user?.category === 'GOOD'
                                    ? 'bg-green-50 text-green-700 border border-green-200'
                                    : 'bg-blue-50 text-blue-700 border border-blue-200'
                                }`}>
                                  {user?.category || 'Member'}
                                </span>
                                <span className="text-xs text-slate-500">
                                  Trust: {user?.trustScore || 0}
                                </span>
                              </div>
                            </div>
                          </div>
                        </div>

                        {/* Menu Items */}
                        <div className="py-2">
                          {profileMenuItems.map((item) => (
                            <Link
                              key={item.href}
                              href={item.href}
                              onClick={() => setIsProfileOpen(false)}
                              className="flex items-center gap-3 px-4 py-3 text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors group"
                            >
                              <div className="text-slate-500 group-hover:text-blue-500">
                                {item.icon}
                              </div>
                              <span className="font-medium">{item.label}</span>
                            </Link>
                          ))}
                        </div>

                        {/* Logout Section */}
                        <div className="border-t border-slate-100 pt-2">
                          <button
                            onClick={handleLogout}
                            className="flex items-center gap-3 w-full px-4 py-3 text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                          >
                            <FaSignOutAlt className="w-4 h-4" />
                            <span>Sign Out</span>
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                </>
              ) : (
                <>
                  {/* Auth Buttons */}
                  <Link
                    href="/auth/login"
                    className="hidden lg:inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-slate-700 hover:text-blue-600 hover:bg-blue-50 transition-all duration-200 font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    className="inline-flex items-center justify-center px-5 py-2.5 lg:px-6 lg:py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg hover:shadow-xl hover:scale-[1.02] transition-all duration-200"
                  >
                    Get Started
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      {isMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-40 bg-black/20 backdrop-blur-sm animate-in fade-in duration-200">
          <div className="fixed inset-y-0 left-0 w-72 bg-white shadow-2xl animate-in slide-in-from-left duration-300">
            {/* Mobile Menu Header */}
            <div className="p-6 border-b border-slate-100">
              <div className="flex items-center justify-between mb-6">
                <Link 
                  href="/" 
                  className="flex items-center gap-3"
                  onClick={() => setIsMenuOpen(false)}
                >
                  <div className="h-12 w-12 rounded-xl bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center shadow-lg">
                    <span className="text-white font-bold text-xl">PM</span>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                      PayMeNow
                    </span>
                    <span className="text-sm text-slate-500">
                      Smart Lending
                    </span>
                  </div>
                </Link>
                <button
                  onClick={() => setIsMenuOpen(false)}
                  className="p-2 rounded-lg hover:bg-slate-100"
                  aria-label="Close menu"
                >
                  <FaTimes className="w-5 h-5 text-slate-700" />
                </button>
              </div>

              {isAuthenticated && user && (
                <div className="flex items-center gap-3 p-3 rounded-xl bg-gradient-to-r from-blue-50 to-indigo-50">
                  {userProfilePic ? (
                    <img
                      src={userProfilePic}
                      alt="Profile"
                      className="h-12 w-12 rounded-full object-cover"
                    />
                  ) : (
                    <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-500 to-indigo-500 flex items-center justify-center text-white font-semibold text-lg">
                      {userInitials}
                    </div>
                  )}
                  <div className="flex-1">
                    <p className="font-semibold text-slate-900">
                      {user.firstName} {user.lastName}
                    </p>
                    <p className="text-sm text-slate-500 truncate">{user.email}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${
                        user?.category === 'EXCELLENT' 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                          : user?.category === 'GOOD'
                          ? 'bg-green-50 text-green-700 border border-green-200'
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {user?.category || 'Member'}
                      </span>
                      <span className="text-xs text-slate-500">
                        Trust: {user?.trustScore || 0}
                      </span>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* Mobile Menu Items */}
            <div className="p-4">
              <div className="space-y-1">
                {navigationItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                  >
                    <div className="text-slate-500">
                      {item.icon}
                    </div>
                    {item.label}
                  </Link>
                ))}
              </div>

              {isAuthenticated && user ? (
                <>
                  <div className="mt-6 pt-4 border-t border-slate-100">
                    <p className="px-4 text-xs font-semibold text-slate-500 uppercase tracking-wider mb-2">
                      Account
                    </p>
                    <div className="space-y-1">
                      {profileMenuItems.map((item) => (
                        <Link
                          key={item.href}
                          href={item.href}
                          onClick={() => setIsMenuOpen(false)}
                          className="flex items-center gap-3 px-4 py-3 rounded-xl text-slate-700 hover:bg-blue-50 hover:text-blue-600 transition-colors font-medium"
                        >
                          <div className="text-slate-500">
                            {item.icon}
                          </div>
                          {item.label}
                        </Link>
                      ))}
                      <button
                        onClick={handleLogout}
                        className="flex items-center gap-3 w-full px-4 py-3 rounded-xl text-rose-600 hover:bg-rose-50 transition-colors font-medium"
                      >
                        <FaSignOutAlt className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>
                </>
              ) : (
                <div className="mt-6 space-y-3">
                  <Link
                    href="/auth/login"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl border border-slate-200 text-slate-700 hover:bg-slate-50 transition-colors font-medium"
                  >
                    Sign In
                  </Link>
                  <Link
                    href="/auth/signup"
                    onClick={() => setIsMenuOpen(false)}
                    className="flex items-center justify-center w-full px-4 py-3 rounded-xl bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold shadow-lg"
                  >
                    Get Started Free
                  </Link>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  );
}