'use client'

import { use, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import {
  ArrowLeft,
  Download,
  Mail,
  Share2,
  MapPin,
  Bed,
  Bath,
  Maximize,
  Calendar,
  TrendingUp,
  FileText
} from 'lucide-react'
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from 'recharts'

// Mock data - replace with API call
const mockValuation = {
  id: '1',
  address: '123 Main Street, San Francisco, CA 94105',
  propertyType: 'SINGLE_FAMILY',
  beds: 3,
  baths: 2,
  sqft: 1500,
  estimatedValue: 1250000,
  valueLow: 1180000,
  valueHigh: 1320000,
  confidenceScore: 85,
  status: 'COMPLETED',
  createdAt: '2025-01-15T10:00:00Z',
  purpose: 'Seller Listing',
  lead: {
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    status: 'NEW',
  },
  comparables: [
    {
      address: '125 Main Street, San Francisco, CA',
      bedrooms: 3,
      bathrooms: 2,
      squareFootage: 1450,
      price: 1230000,
      distance: 0.1,
    },
    {
      address: '456 Oak Avenue, San Francisco, CA',
      bedrooms: 3,
      bathrooms: 2.5,
      squareFootage: 1550,
      price: 1275000,
      distance: 0.3,
    },
    {
      address: '789 Elm Street, San Francisco, CA',
      bedrooms: 4,
      bathrooms: 2,
      squareFootage: 1600,
      price: 1310000,
      distance: 0.5,
    },
  ],
}

// Mock chart data
const priceHistoryData = [
  { month: 'Jan', value: 1150000 },
  { month: 'Feb', value: 1175000 },
  { month: 'Mar', value: 1190000 },
  { month: 'Apr', value: 1210000 },
  { month: 'May', value: 1230000 },
  { month: 'Jun', value: 1250000 },
]

const comparablesChartData = mockValuation.comparables.map((comp, i) => ({
  name: `Comp ${i + 1}`,
  price: comp.price,
  sqft: comp.squareFootage,
}))

export default function ValuationDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params)
  const router = useRouter()
  const [showEmailDialog, setShowEmailDialog] = useState(false)

  const formatCurrency = (value: number) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(value)
  }

  const formatNumber = (value: number) => {
    return new Intl.NumberFormat('en-US').format(value)
  }

  const formatDate = (date: string) => {
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    })
  }

  const handleDownloadPdf = () => {
    // TODO: Implement PDF download
    console.log('Downloading PDF for valuation:', resolvedParams.id)
  }

  const handleSendEmail = () => {
    setShowEmailDialog(true)
    // TODO: Implement email sending
  }

  const handleShare = () => {
    // TODO: Implement share functionality
    console.log('Sharing valuation:', resolvedParams.id)
  }

  return (
    <div className="min-h-screen p-8 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={() => router.back()}
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900">Valuation Report</h1>
            <p className="text-sm text-gray-500">
              Created on {formatDate(mockValuation.createdAt)}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={handleShare}>
            <Share2 className="h-4 w-4 mr-2" />
            Share
          </Button>
          <Button variant="outline" onClick={handleSendEmail}>
            <Mail className="h-4 w-4 mr-2" />
            Email
          </Button>
          <Button onClick={handleDownloadPdf}>
            <Download className="h-4 w-4 mr-2" />
            Download PDF
          </Button>
        </div>
      </div>

      {/* Property Header Card */}
      <Card className="bg-gradient-to-r from-blue-600 to-blue-500 text-white">
        <CardHeader>
          <div className="flex items-start justify-between">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <MapPin className="h-5 w-5" />
                <CardTitle className="text-2xl">{mockValuation.address}</CardTitle>
              </div>
              <CardDescription className="text-blue-100">
                {mockValuation.purpose && `Purpose: ${mockValuation.purpose}`}
              </CardDescription>
            </div>
            <Badge variant={mockValuation.status === 'COMPLETED' ? 'default' : 'secondary'} className="bg-white text-blue-600">
              {mockValuation.status}
            </Badge>
          </div>

          <div className="grid grid-cols-4 gap-4 mt-6">
            <div className="flex items-center gap-2">
              <Bed className="h-5 w-5 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Bedrooms</div>
                <div className="text-lg font-semibold">{mockValuation.beds}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Bath className="h-5 w-5 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Bathrooms</div>
                <div className="text-lg font-semibold">{mockValuation.baths}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <Maximize className="h-5 w-5 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Square Feet</div>
                <div className="text-lg font-semibold">{formatNumber(mockValuation.sqft)}</div>
              </div>
            </div>
            <div className="flex items-center gap-2">
              <FileText className="h-5 w-5 text-blue-200" />
              <div>
                <div className="text-xs text-blue-200">Type</div>
                <div className="text-lg font-semibold">{mockValuation.propertyType.replace('_', ' ')}</div>
              </div>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Valuation Summary */}
      <div className="grid grid-cols-3 gap-6">
        <Card>
          <CardHeader>
            <CardDescription>Estimated Value</CardDescription>
            <CardTitle className="text-3xl text-blue-600">
              {formatCurrency(mockValuation.estimatedValue)}
            </CardTitle>
            {mockValuation.confidenceScore && (
              <p className="text-sm text-gray-500">
                Confidence: {mockValuation.confidenceScore}%
              </p>
            )}
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>Low Estimate</CardDescription>
            <CardTitle className="text-3xl text-gray-900">
              {formatCurrency(mockValuation.valueLow)}
            </CardTitle>
            <p className="text-sm text-gray-500">
              -${formatNumber(mockValuation.estimatedValue - mockValuation.valueLow)}
            </p>
          </CardHeader>
        </Card>

        <Card>
          <CardHeader>
            <CardDescription>High Estimate</CardDescription>
            <CardTitle className="text-3xl text-gray-900">
              {formatCurrency(mockValuation.valueHigh)}
            </CardTitle>
            <p className="text-sm text-gray-500">
              +${formatNumber(mockValuation.valueHigh - mockValuation.estimatedValue)}
            </p>
          </CardHeader>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="overview" className="space-y-4">
        <TabsList>
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="comparables">Comparables</TabsTrigger>
          <TabsTrigger value="location">Location</TabsTrigger>
          <TabsTrigger value="lead">Lead Info</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          {/* Price History Chart */}
          <Card>
            <CardHeader>
              <div className="flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                <CardTitle>Price History Trend</CardTitle>
              </div>
              <CardDescription>
                Estimated value trend over the last 6 months
              </CardDescription>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={priceHistoryData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis
                    tickFormatter={(value) => `$${(value / 1000)}k`}
                  />
                  <Tooltip
                    formatter={(value: number) => formatCurrency(value)}
                  />
                  <Legend />
                  <Line
                    type="monotone"
                    dataKey="value"
                    stroke="#3B82F6"
                    strokeWidth={2}
                    name="Estimated Value"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="comparables" className="space-y-6">
          {/* Comparables Table */}
          <Card>
            <CardHeader>
              <CardTitle>Comparable Properties</CardTitle>
              <CardDescription>
                Similar properties in the area used for valuation
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b">
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Address</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Beds</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Baths</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Sq Ft</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Price</th>
                        <th className="px-4 py-3 text-left text-sm font-medium text-gray-500">Distance</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockValuation.comparables.map((comp, index) => (
                        <tr key={index} className="border-b hover:bg-gray-50">
                          <td className="px-4 py-3 text-sm">{comp.address}</td>
                          <td className="px-4 py-3 text-sm">{comp.bedrooms}</td>
                          <td className="px-4 py-3 text-sm">{comp.bathrooms}</td>
                          <td className="px-4 py-3 text-sm">{formatNumber(comp.squareFootage)}</td>
                          <td className="px-4 py-3 text-sm font-medium">{formatCurrency(comp.price)}</td>
                          <td className="px-4 py-3 text-sm">{comp.distance} mi</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Comparables Chart */}
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={comparablesChartData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis tickFormatter={(value) => `$${(value / 1000)}k`} />
                    <Tooltip formatter={(value: number) => formatCurrency(value)} />
                    <Legend />
                    <Bar dataKey="price" fill="#3B82F6" name="Sale Price" />
                  </BarChart>
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="location" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Property Location</CardTitle>
              <CardDescription>
                Map showing property location and comparable properties
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="w-full h-[400px] bg-gray-100 rounded-lg flex items-center justify-center">
                <div className="text-center text-gray-500">
                  <MapPin className="h-12 w-12 mx-auto mb-2" />
                  <p>Map will be displayed here</p>
                  <p className="text-sm mt-1">{mockValuation.address}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="lead" className="space-y-6">
          {mockValuation.lead && (
            <Card>
              <CardHeader>
                <CardTitle>Lead Information</CardTitle>
                <CardDescription>
                  Contact details for this property valuation
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 gap-6">
                  <div>
                    <label className="text-sm font-medium text-gray-500">Name</label>
                    <p className="text-base mt-1">
                      {mockValuation.lead.firstName} {mockValuation.lead.lastName}
                    </p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Status</label>
                    <div className="mt-1">
                      <Badge variant={mockValuation.lead.status === 'NEW' ? 'default' : 'secondary'}>
                        {mockValuation.lead.status}
                      </Badge>
                    </div>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Email</label>
                    <p className="text-base mt-1">{mockValuation.lead.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-500">Phone</label>
                    <p className="text-base mt-1">{mockValuation.lead.phone}</p>
                  </div>
                </div>

                <div className="mt-6 flex gap-2">
                  <Button variant="outline">
                    <Mail className="h-4 w-4 mr-2" />
                    Send Email
                  </Button>
                  <Button variant="outline">
                    Update Status
                  </Button>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
