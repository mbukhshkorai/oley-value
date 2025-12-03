import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  Briefcase,
  DollarSign,
  AlertTriangle,
  Users,
  Search,
  Download,
  Eye,
  Trash2,
  Phone,
  Mail,
  MapPin
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const stats = [
  {
    title: 'Total Pipeline Value',
    value: '$1.2M',
    description: 'Total asset volume.',
    icon: Briefcase,
    color: 'text-blue-600',
  },
  {
    title: 'Opportunity Value',
    value: '$36K',
    description: 'Est. commission revenue.',
    icon: DollarSign,
    color: 'text-green-600',
  },
  {
    title: 'Action Required',
    value: '3',
    description: 'Leads needing follow-up.',
    icon: AlertTriangle,
    color: 'text-orange-600',
  },
  {
    title: 'Total Leads',
    value: '10',
    description: 'Total contacts in database.',
    icon: Users,
    color: 'text-purple-600',
  },
]

const leads = [
  {
    name: 'Jessica Chen',
    source: 'Website Widget',
    phone: '(555) 123-4567',
    email: 'j.chen@mail.com',
    address: '1805 S Orianna St...',
    city: 'Philadelphia, PA 19148',
    valuation: 396000,
    commission: 11880,
    status: 'new',
    created: '2 hours ago',
  },
  {
    name: 'Mark Poulos',
    source: 'Manual Input',
    phone: '(555) 987-6543',
    email: 'mpoulos@inquire.net',
    address: '440 West Ave...',
    city: 'Austin, TX 78701',
    valuation: 850000,
    commission: 25500,
    status: 'contacted',
    created: '5 days ago',
  },
  {
    name: 'Sarah Klein',
    source: 'Website Widget',
    phone: '(555) 555-0000',
    email: 'sarahk@client.org',
    address: '12 Ocean Drive...',
    city: 'Miami, FL 33139',
    valuation: 1200000,
    commission: 36000,
    status: 'qualified',
    created: '2 hours ago',
  },
]

const filterTabs = [
  { label: 'All Leads', count: 10, value: 'all' },
  { label: 'New', count: 3, value: 'new' },
  { label: 'Contacted', count: 2, value: 'contacted' },
  { label: 'Qualified', count: 2, value: 'qualified' },
  { label: 'Archived', count: 3, value: 'archived' },
]

export default function LeadsPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Lead Management</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <Card key={stat.title}>
            <CardContent className="p-6">
              <div className="flex items-start justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">{stat.title}</p>
                  <p className="mt-2 text-3xl font-extrabold text-gray-900">
                    {stat.value}
                  </p>
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

      {/* Prospect Database */}
      <Card>
        <CardHeader>
          <CardTitle>Prospect Database</CardTitle>
          <CardDescription>
            Filter, search, and manage your contacts to ensure no lead falls through the cracks.
          </CardDescription>
        </CardHeader>
        <CardContent>
          {/* Filter Tabs */}
          <div className="mb-6 flex items-center space-x-3 overflow-x-auto">
            {filterTabs.map((tab) => (
              <button
                key={tab.value}
                className={`flex items-center space-x-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-medium transition-colors ${
                  tab.value === 'all'
                    ? 'bg-primary-600 text-white'
                    : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                }`}
              >
                <span>{tab.count}</span>
                <span>•</span>
                <span>{tab.label}</span>
              </button>
            ))}
          </div>

          {/* Search and Actions */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by name..."
                className="pl-9"
              />
            </div>
            <div className="flex space-x-3">
              <Button variant="outline" size="sm">
                Sort
              </Button>
              <Button variant="outline" size="sm">
                <Download className="mr-2 h-4 w-4" />
                Export
              </Button>
            </div>
          </div>

          {/* Leads Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                  <th className="pb-3 pr-4">Lead</th>
                  <th className="pb-3 pr-4">Contact</th>
                  <th className="pb-3 pr-4">Valuation</th>
                  <th className="pb-3 pr-4">Commission Est.</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3 pr-4">Created</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {leads.map((lead, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 pr-4">
                      <div>
                        <p className="font-medium text-gray-900">{lead.name}</p>
                        <p className="text-sm text-gray-500">{lead.source}</p>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div className="space-y-1 text-sm">
                        <div className="flex items-center text-gray-600">
                          <Phone className="mr-2 h-3.5 w-3.5" />
                          {lead.phone}
                        </div>
                        <div className="flex items-center text-gray-600">
                          <Mail className="mr-2 h-3.5 w-3.5" />
                          {lead.email}
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <div>
                        <div className="flex items-center text-sm text-gray-600">
                          <MapPin className="mr-1 h-3.5 w-3.5" />
                          {lead.address}
                        </div>
                        <p className="mt-1 font-semibold text-gray-900">
                          {formatCurrency(lead.valuation)}
                        </p>
                      </div>
                    </td>
                    <td className="py-4 pr-4 font-semibold text-gray-900">
                      {formatCurrency(lead.commission)}
                    </td>
                    <td className="py-4 pr-4">
                      <Badge
                        variant={lead.status as any}
                        className="capitalize"
                      >
                        {lead.status}
                      </Badge>
                    </td>
                    <td className="py-4 pr-4 text-sm text-gray-500">
                      {lead.created}
                    </td>
                    <td className="py-4">
                      <div className="flex space-x-1">
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Eye className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="icon" className="h-8 w-8 text-error-600">
                          <Trash2 className="h-4 w-4" />
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
    </div>
  )
}
