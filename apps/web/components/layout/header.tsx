"use client"

import { Search, Bell } from 'lucide-react'
import { Input } from '@/components/ui/input'
import { Badge } from '@/components/ui/badge'

export function Header() {
  return (
    <header className="sticky top-0 z-10 flex h-16 items-center justify-between border-b border-gray-200 bg-white px-6">
      {/* Welcome Message */}
      <div>
        <h1 className="text-lg font-medium text-gray-900">
          Welcome back, <span className="text-primary-600">John!</span>
        </h1>
      </div>

      {/* Right Section */}
      <div className="flex items-center space-x-4">
        {/* Plan Badge */}
        <Badge variant="default" className="bg-gray-100 text-gray-700">
          Free Tier
        </Badge>

        {/* Credits */}
        <div className="text-sm">
          <span className="font-medium text-gray-900">Credits:</span>{' '}
          <span className="text-gray-600">5/20</span>
        </div>

        {/* Search */}
        <div className="relative w-64">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
          <Input
            type="search"
            placeholder="Search..."
            className="pl-9"
          />
        </div>

        {/* Notifications */}
        <button className="relative rounded-lg p-2 hover:bg-gray-100">
          <Bell className="h-5 w-5 text-gray-600" />
          <span className="absolute right-1 top-1 h-2 w-2 rounded-full bg-primary-600"></span>
        </button>

        {/* User Profile */}
        <div className="flex items-center space-x-3">
          <div className="h-9 w-9 overflow-hidden rounded-full bg-gray-200">
            <img
              src="https://ui-avatars.com/api/?name=John+Smith&background=2563EB&color=fff"
              alt="John Smith"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="text-sm">
            <p className="font-medium text-gray-900">John Smith</p>
            <p className="text-xs text-gray-500">johnsmith@gmail.com</p>
          </div>
        </div>
      </div>
    </header>
  )
}
