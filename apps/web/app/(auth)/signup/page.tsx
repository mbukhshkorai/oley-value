"use client"

import { useState } from 'react'
import Link from 'next/link'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Button } from '@/components/ui/button'
import { Crown } from 'lucide-react'

const accountTypes = [
  { value: 'INDIVIDUAL_AGENT', label: 'Individual Agent' },
  { value: 'TEAM', label: 'Team' },
  { value: 'BROKERAGE', label: 'Brokerage' },
]

export default function SignupPage() {
  const [accountType, setAccountType] = useState('INDIVIDUAL_AGENT')

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-50 px-4 py-12">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex h-12 w-12 items-center justify-center rounded-lg bg-primary-600">
              <span className="text-2xl font-bold text-white">V</span>
            </div>
          </div>
          <CardTitle className="text-2xl">
            Create your Valu<span className="text-primary-600">Pro</span> account
          </CardTitle>
          <CardDescription>
            Start generating professional home valuations today
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form className="space-y-4">
            {/* Name Fields */}
            <div className="grid gap-4 md:grid-cols-2">
              <div>
                <Label htmlFor="firstName">First Name</Label>
                <Input
                  id="firstName"
                  placeholder="John"
                  className="mt-2"
                  required
                />
              </div>
              <div>
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  placeholder="Smith"
                  className="mt-2"
                  required
                />
              </div>
            </div>

            {/* Email */}
            <div>
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                placeholder="john@example.com"
                className="mt-2"
                required
              />
            </div>

            {/* Phone */}
            <div>
              <Label htmlFor="phone">Phone Number</Label>
              <Input
                id="phone"
                type="tel"
                placeholder="(555) 123-4567"
                className="mt-2"
              />
            </div>

            {/* Account Type */}
            <div>
              <Label>Account Type</Label>
              <div className="mt-2 grid gap-3">
                {accountTypes.map((type) => (
                  <button
                    key={type.value}
                    type="button"
                    onClick={() => setAccountType(type.value)}
                    className={`rounded-lg border-2 px-4 py-3 text-left text-sm font-medium transition-all ${
                      accountType === type.value
                        ? 'border-primary-600 bg-primary-50 text-primary-600'
                        : 'border-gray-200 bg-white text-gray-700 hover:border-gray-300'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Password */}
            <div>
              <Label htmlFor="password">Password</Label>
              <Input
                id="password"
                type="password"
                placeholder="Create a strong password"
                className="mt-2"
                required
              />
            </div>

            {/* Confirm Password */}
            <div>
              <Label htmlFor="confirmPassword">Confirm Password</Label>
              <Input
                id="confirmPassword"
                type="password"
                placeholder="Confirm your password"
                className="mt-2"
                required
              />
            </div>

            {/* Terms Consent */}
            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                id="terms"
                className="mt-1 h-4 w-4 rounded border-gray-300 text-primary-600 focus:ring-primary-500"
                required
              />
              <label htmlFor="terms" className="text-sm text-gray-600">
                I agree to the{' '}
                <Link href="/terms" className="text-primary-600 hover:underline">
                  Terms of Service
                </Link>{' '}
                and{' '}
                <Link href="/privacy" className="text-primary-600 hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            {/* Submit Button */}
            <Button type="submit" className="w-full">
              Create Free Account
            </Button>

            {/* Pro Plan CTA */}
            <div className="rounded-lg bg-primary-50 p-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Crown className="h-5 w-5 text-primary-600" />
                  <div>
                    <p className="text-sm font-semibold text-gray-900">
                      Start with Pro Plan
                    </p>
                    <p className="text-xs text-gray-600">
                      100 valuations/month for $29
                    </p>
                  </div>
                </div>
                <Button size="sm" variant="outline">
                  Choose Pro
                </Button>
              </div>
            </div>

            {/* Login Link */}
            <div className="text-center text-sm text-gray-600">
              Already have an account?{' '}
              <Link href="/login" className="font-medium text-primary-600 hover:underline">
                Sign in
              </Link>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}
