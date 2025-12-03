"use client"

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
  LayoutDashboard,
  FileText,
  History,
  Users,
  Code2,
  User,
  CreditCard,
  HelpCircle,
  LogOut,
  Crown
} from 'lucide-react'
import { cn } from '@/lib/utils'
import { Button } from '@/components/ui/button'

const navigation = [
  {
    name: 'GENERAL',
    items: [
      { name: 'Dashboard', href: '/dashboard', icon: LayoutDashboard },
      { name: 'New Valuation', href: '/dashboard/new-valuation', icon: FileText },
      { name: 'History', href: '/dashboard/history', icon: History },
      { name: 'Leads', href: '/dashboard/leads', icon: Users },
      { name: 'Widgets', href: '/dashboard/widgets', icon: Code2 },
    ],
  },
  {
    name: 'OTHER',
    items: [
      { name: 'Profile', href: '/dashboard/profile', icon: User },
      { name: 'Billings & Plans', href: '/dashboard/billing', icon: CreditCard },
      { name: 'Help/Support', href: '/dashboard/support', icon: HelpCircle },
      { name: 'Log Out', href: '/logout', icon: LogOut },
    ],
  },
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <div className="flex h-full w-64 flex-col border-r border-gray-200 bg-white">
      {/* Logo */}
      <div className="flex h-16 items-center border-b border-gray-200 px-6">
        <Link href="/dashboard" className="flex items-center space-x-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary-600">
            <span className="text-lg font-bold text-white">V</span>
          </div>
          <span className="text-xl font-bold text-gray-900">
            Valu<span className="text-primary-600">Pro</span>
          </span>
        </Link>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-8 overflow-y-auto px-4 py-6">
        {navigation.map((section) => (
          <div key={section.name}>
            <h3 className="mb-3 px-3 text-xs font-semibold uppercase tracking-wider text-gray-500">
              {section.name}
            </h3>
            <ul className="space-y-1">
              {section.items.map((item) => {
                const isActive = pathname === item.href
                return (
                  <li key={item.name}>
                    <Link
                      href={item.href}
                      className={cn(
                        "flex items-center space-x-3 rounded-lg px-3 py-2 text-sm font-medium transition-colors",
                        isActive
                          ? "bg-primary-50 text-primary-600"
                          : "text-gray-600 hover:bg-gray-100 hover:text-gray-900"
                      )}
                    >
                      <item.icon className="h-5 w-5" />
                      <span>{item.name}</span>
                    </Link>
                  </li>
                )
              })}
            </ul>
          </div>
        ))}
      </nav>

      {/* Upgrade CTA */}
      <div className="border-t border-gray-200 p-4">
        <div className="rounded-lg bg-primary-600 p-4 text-white">
          <div className="mb-2 flex items-center space-x-2">
            <Crown className="h-5 w-5" />
            <span className="font-semibold">Go Pro Now</span>
          </div>
          <p className="mb-3 text-xs text-primary-100">
            Upgrade for full features
          </p>
          <Button
            size="sm"
            variant="outline"
            className="w-full border-white bg-white text-primary-600 hover:bg-primary-50"
          >
            Upgrade
          </Button>
        </div>
      </div>
    </div>
  )
}
