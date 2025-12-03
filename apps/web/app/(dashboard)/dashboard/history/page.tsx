import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import {
  FileText,
  DollarSign,
  TrendingUp,
  Search,
  Download,
  Eye,
  Trash2,
  Bed,
  Bath,
  Maximize
} from 'lucide-react'
import { formatCurrency } from '@/lib/utils'

const stats = [
  {
    title: 'Total Valuations',
    value: '5',
    description: '+2 reports generated in last 7 days',
    icon: FileText,
    color: 'text-blue-600',
  },
  {
    title: 'Portfolio Volume',
    value: '$2M+',
    description: 'Combined value of all properties',
    icon: DollarSign,
    color: 'text-green-600',
  },
  {
    title: 'Avg. Property Value',
    value: '$400K',
    description: 'Your average market price point',
    icon: TrendingUp,
    color: 'text-purple-600',
  },
]

const valuations = [
  {
    address: '1805 S Orianna St, Philadelphia, PA 19148',
    leadName: 'Jessica Chen',
    valuation: 396000,
    beds: 2,
    baths: 2.5,
    sqft: 1775,
    status: 'viewed',
  },
  {
    address: '440 West Ave, Austin, TX 78701',
    leadName: 'Sarah Jones',
    valuation: 850000,
    beds: 4,
    baths: 3,
    sqft: 2400,
    status: 'sent',
  },
  {
    address: '12 Ocean Drive, Miami, FL 33139',
    leadName: 'John Smith',
    valuation: 1200000,
    beds: 3,
    baths: 2,
    sqft: 1500,
    status: 'draft',
  },
]

export default function HistoryPage() {
  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Valuation History</h1>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-3">
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

      {/* All Valuation Reports */}
      <Card>
        <CardHeader>
          <CardTitle>All Valuation Reports</CardTitle>
          <CardDescription>View and manage your property valuations</CardDescription>
        </CardHeader>
        <CardContent>
          {/* Search and Actions */}
          <div className="mb-6 flex items-center justify-between">
            <div className="relative w-64">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400" />
              <Input
                type="search"
                placeholder="Search by address..."
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

          {/* Valuations Table */}
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 text-left text-sm font-semibold text-gray-700">
                  <th className="pb-3 pr-4">Property Details</th>
                  <th className="pb-3 pr-4">Lead Name</th>
                  <th className="pb-3 pr-4">Valuation</th>
                  <th className="pb-3 pr-4">Specs</th>
                  <th className="pb-3 pr-4">Status</th>
                  <th className="pb-3">Actions</th>
                </tr>
              </thead>
              <tbody>
                {valuations.map((valuation, index) => (
                  <tr key={index} className="border-b border-gray-100">
                    <td className="py-4 pr-4">
                      <p className="font-medium text-gray-900">{valuation.address}</p>
                    </td>
                    <td className="py-4 pr-4 text-gray-600">
                      {valuation.leadName}
                    </td>
                    <td className="py-4 pr-4 font-semibold text-gray-900">
                      {formatCurrency(valuation.valuation)}
                    </td>
                    <td className="py-4 pr-4">
                      <div className="flex items-center space-x-3 text-sm text-gray-600">
                        <div className="flex items-center">
                          <Bed className="mr-1 h-3.5 w-3.5" />
                          {valuation.beds}
                        </div>
                        <div className="flex items-center">
                          <Bath className="mr-1 h-3.5 w-3.5" />
                          {valuation.baths}
                        </div>
                        <div className="flex items-center">
                          <Maximize className="mr-1 h-3.5 w-3.5" />
                          {valuation.sqft.toLocaleString()} sqft
                        </div>
                      </div>
                    </td>
                    <td className="py-4 pr-4">
                      <Badge
                        variant={valuation.status as any}
                        className="capitalize"
                      >
                        {valuation.status}
                      </Badge>
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
