"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Menu, User, Calendar, MapPin, BarChart3, Building2, Clock, Settings, LogOut, Shield } from "lucide-react"
import { useAuth } from "@/lib/auth-context"
import { useRouter } from "next/navigation"
import { Badge } from "@/components/ui/badge"

export function Navigation() {
  const { user, isAuthenticated, logout, getUserRole } = useAuth()
  const router = useRouter()

  const userNavItems = [
    { href: "/", label: "Home", icon: MapPin },
    { href: "/venues", label: "Venues", icon: Building2 },
    { href: "/bookings", label: "My Bookings", icon: Calendar },
    { href: "/profile", label: "Profile", icon: User },
  ]

  const facilityOwnerNavItems = [
    { href: "/owner/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/owner/facilities", label: "My Facilities", icon: Building2 },
    { href: "/owner/courts", label: "Court Management", icon: MapPin },
    { href: "/owner/bookings", label: "Booking Overview", icon: Calendar },
    { href: "/owner/time-slots", label: "Time Slots", icon: Clock },
    { href: "/owner/profile", label: "Profile", icon: User },
  ]

  const adminNavItems = [
    { href: "/admin/dashboard", label: "Dashboard", icon: BarChart3 },
    { href: "/admin/facilities", label: "Facility Approvals", icon: Building2 },
    { href: "/admin/users", label: "User Management", icon: User },
    { href: "/admin/reports", label: "Reports & Moderation", icon: Shield },
    { href: "/admin/profile", label: "Profile", icon: Settings },
  ]

  const getNavItems = () => {
    const role = getUserRole()
    if (role === "facility_owner") return facilityOwnerNavItems
    if (role === "admin") return adminNavItems
    return userNavItems
  }

  const navItems = getNavItems()

  const handleNavClick = (href) => {
    router.push(href)
  }

  const handleLogin = () => {
    router.push("/auth/login")
  }

  const handleSignup = () => {
    router.push("/auth/signup")
  }

  const handleLogout = () => {
    logout()
    router.push("/")
  }

  const getRoleDisplayName = () => {
    const role = getUserRole()
    if (role === "facility_owner") return "Facility Owner"
    if (role === "admin") return "Admin"
    return "User"
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4 flex h-16 items-center justify-between">
        <div className="flex items-center space-x-4">
          <a
            href="/"
            className="flex items-center space-x-2"
            onClick={(e) => {
              e.preventDefault()
              handleNavClick("/")
            }}
          >
            <div className="bg-blue-600 text-white p-2 rounded-lg">
              <MapPin className="h-5 w-5" />
            </div>
            <span className="text-xl font-bold">QuickCourt</span>
          </a>

          {/* Role Display for Authenticated Users */}
          {isAuthenticated && (
            <div className="hidden md:flex items-center space-x-2">
              <span className="text-sm text-gray-600">Role:</span>
              <Badge variant="secondary" className="text-xs">
                {getRoleDisplayName()}
              </Badge>
            </div>
          )}
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-6">
          {navItems.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => {
                e.preventDefault()
                handleNavClick(item.href)
              }}
              className="flex items-center space-x-1 text-sm font-medium transition-colors hover:text-blue-600 cursor-pointer"
            >
              <item.icon className="h-4 w-4" />
              <span>{item.label}</span>
            </a>
          ))}
        </nav>

        {/* Desktop Auth */}
        <div className="hidden md:flex items-center space-x-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={user?.profile?.avatar || "/placeholder-user.jpg"} alt="User" />
                    <AvatarFallback>{user?.fullname?.charAt(0) || "U"}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56" align="end">
                <div className="px-2 py-1.5 text-sm font-medium">
                  {user?.fullname}
                </div>
                <div className="px-2 py-1.5 text-xs text-gray-500">
                  {getRoleDisplayName()}
                </div>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => handleNavClick("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  Profile
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => handleNavClick("/settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  Settings
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleLogout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  Logout
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <>
              <Button variant="ghost" size="sm" onClick={handleLogin}>
                Login
              </Button>
              <Button size="sm" onClick={handleSignup}>
                Sign Up
              </Button>
            </>
          )}
        </div>

        {/* Mobile Navigation */}
        <Sheet>
          <SheetTrigger asChild className="md:hidden">
            <Button variant="ghost" size="sm">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="right" className="w-[300px]">
            <div className="flex flex-col space-y-4">
              {isAuthenticated && (
                <div className="flex items-center space-x-2 p-2 bg-gray-50 rounded">
                  <span className="text-sm text-gray-600">Role:</span>
                  <Badge variant="secondary" className="text-xs">
                    {getRoleDisplayName()}
                  </Badge>
                </div>
              )}

              {navItems.map((item) => (
                <a
                  key={item.href}
                  href={item.href}
                  onClick={(e) => {
                    e.preventDefault()
                    handleNavClick(item.href)
                  }}
                  className="flex items-center space-x-2 text-sm font-medium transition-colors hover:text-blue-600 cursor-pointer"
                >
                  <item.icon className="h-4 w-4" />
                  <span>{item.label}</span>
                </a>
              ))}

              {isAuthenticated ? (
                <div className="pt-4 border-t">
                  <div className="px-2 py-1.5 text-sm font-medium mb-2">
                    {user?.fullname}
                  </div>
                  <Button variant="ghost" size="sm" className="w-full justify-start" onClick={handleLogout}>
                    <LogOut className="mr-2 h-4 w-4" />
                    Logout
                  </Button>
                </div>
              ) : (
                <div className="pt-4 border-t space-y-2">
                  <Button variant="ghost" size="sm" className="w-full" onClick={handleLogin}>
                    Login
                  </Button>
                  <Button size="sm" className="w-full" onClick={handleSignup}>
                    Sign Up
                  </Button>
                </div>
              )}
            </div>
          </SheetContent>
        </Sheet>
      </div>
    </header>
  )
}
