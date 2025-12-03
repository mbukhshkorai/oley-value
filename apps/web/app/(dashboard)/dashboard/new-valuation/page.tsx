"use client"

import { useState } from 'react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { ArrowLeft, ArrowRight, FileText, Users, Sparkles, Save } from 'lucide-react'
import { cn } from '@/lib/utils'

const steps = [
  { number: 1, title: 'Address', key: 'address' },
  { number: 2, title: 'Info', key: 'info' },
  { number: 3, title: 'Purpose', key: 'purpose' },
]

const propertyTypes = [
  'Single Family',
  'Condo',
  'Townhouse',
  'Multi-Family',
  'Land',
]

export default function NewValuationPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [isNewClient, setIsNewClient] = useState(true)
  const [selectedPropertyType, setSelectedPropertyType] = useState('Single Family')

  return (
    <div className="space-y-6">
      {/* Page Title */}
      <div>
        <h1 className="text-2xl font-bold text-gray-900">New Property Valuation</h1>
      </div>

      <div className="grid gap-6 lg:grid-cols-3">
        {/* Left Side - Form */}
        <div className="lg:col-span-2">
          <Card>
            <CardContent className="p-6">
              {/* Header */}
              <div className="mb-6">
                <h2 className="text-xl font-semibold text-gray-900">Start New Valuation</h2>
                <p className="mt-1 text-sm text-gray-500">
                  Enter property details to generate a comprehensive market report.
                </p>
              </div>

              {/* Progress Steps */}
              <div className="mb-8 flex items-center justify-center space-x-4">
                {steps.map((step, index) => (
                  <div key={step.number} className="flex items-center">
                    <div className="flex items-center space-x-2">
                      <div
                        className={cn(
                          "flex h-8 w-8 items-center justify-center rounded-full text-sm font-semibold",
                          currentStep >= step.number
                            ? "bg-primary-600 text-white"
                            : "bg-gray-200 text-gray-600"
                        )}
                      >
                        0{step.number}
                      </div>
                      <span
                        className={cn(
                          "text-sm font-medium",
                          currentStep >= step.number
                            ? "text-primary-600"
                            : "text-gray-500"
                        )}
                      >
                        {step.title}
                      </span>
                    </div>
                    {index < steps.length - 1 && (
                      <div
                        className={cn(
                          "mx-4 h-0.5 w-12",
                          currentStep > step.number
                            ? "bg-primary-600"
                            : "bg-gray-200"
                        )}
                      />
                    )}
                  </div>
                ))}
              </div>

              {/* Step 1: Address */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="address">Property Address</Label>
                    <Input
                      id="address"
                      placeholder="e.g., 123 Main St, San Francisco, CA 94105"
                      className="mt-2"
                    />
                  </div>

                  <div>
                    <Label>Property Type</Label>
                    <div className="mt-2 grid grid-cols-5 gap-3">
                      {propertyTypes.map((type) => (
                        <button
                          key={type}
                          onClick={() => setSelectedPropertyType(type)}
                          className={cn(
                            "rounded-lg border-2 px-4 py-3 text-sm font-medium transition-all",
                            selectedPropertyType === type
                              ? "border-primary-600 bg-primary-50 text-primary-600"
                              : "border-gray-200 bg-white text-gray-700 hover:border-gray-300"
                          )}
                        >
                          {type}
                        </button>
                      ))}
                    </div>
                  </div>

                  <div className="flex justify-end">
                    <Button onClick={() => setCurrentStep(2)}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 2: Client Info */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  {/* Toggle between Create New / Select Existing */}
                  <div className="flex overflow-hidden rounded-lg border border-gray-200">
                    <button
                      onClick={() => setIsNewClient(true)}
                      className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                        isNewClient
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Create New Client
                    </button>
                    <button
                      onClick={() => setIsNewClient(false)}
                      className={cn(
                        "flex-1 px-4 py-2 text-sm font-medium transition-colors",
                        !isNewClient
                          ? "bg-primary-600 text-white"
                          : "bg-white text-gray-700 hover:bg-gray-50"
                      )}
                    >
                      Select Existing Lead
                    </button>
                  </div>

                  {isNewClient ? (
                    <div className="space-y-4">
                      <div>
                        <Label htmlFor="clientName">Client Name *</Label>
                        <Input
                          id="clientName"
                          placeholder="e.g. Jane Doe"
                          className="mt-2"
                        />
                      </div>
                      <div className="grid gap-4 md:grid-cols-2">
                        <div>
                          <Label htmlFor="email">Email</Label>
                          <Input
                            id="email"
                            type="email"
                            placeholder="e.g. jane@mail.com"
                            className="mt-2"
                          />
                        </div>
                        <div>
                          <Label htmlFor="phone">Phone</Label>
                          <Input
                            id="phone"
                            type="tel"
                            placeholder="e.g. 123 456 7890"
                            className="mt-2"
                          />
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div>
                      <Label htmlFor="existingLead">Select Lead</Label>
                      <select
                        id="existingLead"
                        className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2"
                      >
                        <option>Jessica Chen</option>
                        <option>Mark Poulos</option>
                        <option>Sarah Klein</option>
                      </select>
                    </div>
                  )}

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(1)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <Button onClick={() => setCurrentStep(3)}>
                      Next
                      <ArrowRight className="ml-2 h-4 w-4" />
                    </Button>
                  </div>
                </div>
              )}

              {/* Step 3: Purpose */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <Label htmlFor="purpose">Valuation Purpose</Label>
                    <select
                      id="purpose"
                      className="mt-2 w-full rounded-md border border-gray-200 bg-white px-3 py-2"
                    >
                      <option>Seller Listing</option>
                      <option>Buyer Assessment</option>
                      <option>Refinance</option>
                      <option>Investment Analysis</option>
                    </select>
                  </div>

                  <div className="flex justify-between">
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(2)}
                    >
                      <ArrowLeft className="mr-2 h-4 w-4" />
                      Back
                    </Button>
                    <div className="flex space-x-3">
                      <Button variant="outline">
                        <Save className="mr-2 h-4 w-4" />
                        Save Draft
                      </Button>
                      <Button>
                        <Sparkles className="mr-2 h-4 w-4" />
                        Generate Report
                      </Button>
                    </div>
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Credit Info */}
          <Card className="mt-6">
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-3">
                  <div className="relative h-12 w-12">
                    <svg className="h-12 w-12 -rotate-90 transform">
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#E5E7EB"
                        strokeWidth="4"
                        fill="none"
                      />
                      <circle
                        cx="24"
                        cy="24"
                        r="20"
                        stroke="#3B82F6"
                        strokeWidth="4"
                        fill="none"
                        strokeDasharray={`${(5 / 20) * 125.6} 125.6`}
                      />
                    </svg>
                    <div className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gray-900">
                      5/20
                    </div>
                  </div>
                  <div>
                    <p className="font-semibold text-gray-900">Pro Plan Active</p>
                    <p className="text-sm text-gray-500">15 Credits Available.</p>
                  </div>
                </div>
                <Button variant="link" className="text-primary-600">
                  Purchase More Credits →
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Right Side - Live Map & Info */}
        <div className="space-y-6">
          {/* Live Map */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3 font-semibold text-gray-900">Live Map</h3>
              <div className="aspect-square overflow-hidden rounded-lg bg-gray-100">
                <div className="flex h-full items-center justify-center text-sm text-gray-500">
                  Map will appear here
                </div>
              </div>
            </CardContent>
          </Card>

          {/* How We Generate */}
          <Card>
            <CardContent className="p-4">
              <h3 className="mb-3 font-semibold text-gray-900">How We Generate Your Value</h3>
              <p className="mb-4 text-sm text-gray-500">
                Enter property details to generate a comprehensive market report.
              </p>
              <div className="space-y-4">
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <FileText className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">01. Real-Time Comps</p>
                    <p className="text-sm text-gray-500">
                      We analyze active listings and recent sales within a 2-mile radius.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Users className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">02. AI Adjustment</p>
                    <p className="text-sm text-gray-500">
                      Our algorithm adjusts for market trends & property condition.
                    </p>
                  </div>
                </div>
                <div className="flex items-start space-x-3">
                  <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-blue-50">
                    <Sparkles className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">03. White-Label Ready</p>
                    <p className="text-sm text-gray-500">
                      Report is generated with your branding, ready to send or print.
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}
