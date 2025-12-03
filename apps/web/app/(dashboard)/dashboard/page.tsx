import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Target,
  Users,
  DollarSign,
  Home,
  FileText,
  UsersIcon,
  Code2,
  CreditCard,
  Download,
  Eye
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const stats = [
  {
    title: 'Valuation Usage',
    value: '5',
    subtitle: '/ 20',
    description: '15 remaining this month',
    icon: Target,
    color: 'text-primary-600',
  },
  {
    title: 'Total Leads',
    value: '10',
    description: 'Total contacts in your pipeline',
    icon: Users,
    color: 'text-blue-600',
  },
  {
    title: 'Opportunity Value',
    value: '$1,500',
    description: 'Commission on Active Leads',
    icon: DollarSign,
    color: 'text-green-600',
  },
  {
    title: 'Total Portfolio Value',
    value: '$1.2M',
    description: 'Sum of all properties valued',
    icon: Home,
    color: 'text-purple-600',
  },
]

const recentLeads = [
  {
    status: 'new',
    name: 'Jessica Chen',
    address: '489 Kingfisher Lane...',
    value: 815000,
    time: '3 min ago',
  },
  {
    status: 'contacted',
    name: 'Mark Poulos',
    address: '199 N 3rd Street...',
    value: 550500,
    time: '1 hour ago',
  },
  {
    status: 'contacted',
    name: 'Sarah Williams',
    address: '801 Magnolia Ave...',
    value: 410200,
    time: 'Yesterday',
  },
  {
    status: 'qualified',
    name: 'Alex Gonzales',
    address: '303 Mesa Drive...',
    value: 0,
    time: 'Yesterday',
  },
]

const quickActions = [
  { title: 'Create New Valuation', icon: FileText, href: '/dashboard/new-valuation' },
  { title: 'Manage Leads', icon: UsersIcon, href: '/dashboard/leads' },
  { title: 'Manage Widgets', icon: Code2, href: '/dashboard/widgets' },
  { title: 'View Billing & Plans', icon: CreditCard, href: '/dashboard/billing' },
]

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <div className="mt-2 flex items-baseline space-x-1">
                    <p className="text-3xl font-extrabold text-gray-900">
                      {stat.value}
                    </p>
                    {stat.subtitle && (
                      <span className="text-2xl font-semibold text-gray-400">
                        {stat.subtitle}
                      </span>
                    )}
                  </div>
                  <p className="mt-1 text-sm text-gray-500">{stat.description}</p>
                </div>
                <div className={`rounded-lg bg-gray-50 p-3 ${stat.color}`}>
                  <stat.icon className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Recent Lead Opportunities */}
      <Card>
        <CardHeader>
          <div className="flex items-center justify-between">
            <div>
              <CardTitle>Recent Lead Opportunities</CardTitle>
              <CardDescription>Latest contacts and reports generated.</CardDescription>
            </div>
            <Button variant="outline" size="sm">
              View All Leads
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                  <th className="pb-3">Status</th>
                  <th className="pb-3">Lead Name</th>
                  <th className="pb-3">Address</th>
                  <th className="pb-3">Est. Value</th>
                  <th className="pb-3">Time</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {recentLeads.map((lead, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4">
                      <Badge
                        variant={lead.status as any}
                        className="capitalize"
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-4 font-medium text-gray-900">{lead.name}</td>
                    <td className="py-4 text-gray-600">{lead.address}</td>
                    <td className="py-4 font-semibold text-gray-900">
                      {lead.value > 0 ? formatCurrency(lead.value) : '-'}
                    </td>
                    <td className="py-4 text-sm text-gray-500">{lead.time}</td>
                    <td className="py-4">
                      <div className="flex space-x-2">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>

      {/* Quick Actions and Widgets Section */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Jump to your most frequent tasks.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid gap-3">
              {quickActions.map((action) => (
                <Button
                  key={action.title}
                  variant="outline"
                  className="justify-start"
                  asChild
                >
                  <a href={action.href}>
                    <action.icon className="mr-2 h-4 w-4" />
                    {action.title}
                  </a>
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Manage Widgets */}
        <Card>
          <CardHeader>
            <CardTitle>Manage Widgets</CardTitle>
            <CardDescription>Your property valuation lead capture tool.</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Active Widgets</p>
                  <p className="text-3xl font-extrabold text-gray-900">3</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Lead Generated</p>
                  <p className="text-3xl font-extrabold text-gray-900">10</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-600">Average Conversion</p>
                  <p className="text-3xl font-extrabold text-gray-900">43%</p>
                </div>
              </div>
              <div className="flex space-x-3">
                <Button className="flex-1">Go To Setup</Button>
                <Button variant="outline" className="flex-1">
                  Copy Embed Code
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}
