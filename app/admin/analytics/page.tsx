'use client'

import { useState, useEffect } from 'react'
import { Card } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { AnalyticsChart } from '@/components/admin/analytics-chart'
import {
  getAnalyticsData,
  getPerformanceMetrics,
  getTrendData,
  exportAnalyticsData,
  type AnalyticsData,
} from '@/app/actions/analytics'

interface PerformanceMetrics {
  pageLoadTimes: {
    average: number
    p50: number
    p95: number
    p99: number
  }
  errorRates: {
    total: number
    rate: number
    last24h: number
  }
  apiResponseTimes: {
    average: number
    p50: number
    p95: number
    p99: number
  }
  uptime: {
    percentage: number
    lastIncident: string | null
  }
}

export default function AnalyticsPage() {
  const [analytics, setAnalytics] = useState<AnalyticsData | null>(null)
  const [performance, setPerformance] = useState<PerformanceMetrics | null>(null)
  const [loading, setLoading] = useState(true)
  const [dateRange, setDateRange] = useState<'7' | '30' | '90'>('30')
  const [exporting, setExporting] = useState(false)
  const [selectedMetric, setSelectedMetric] = useState<string>('users')
  const [trendData, setTrendData] = useState<Array<{ date: string; value: number }>>([])
  const [loadingTrend, setLoadingTrend] = useState(false)

  useEffect(() => {
    loadData()
  }, [dateRange])

  useEffect(() => {
    loadTrendData()
  }, [selectedMetric, dateRange])

  const loadData = async () => {
    setLoading(true)

    const days = parseInt(dateRange)
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    const [analyticsResult, performanceResult] = await Promise.all([
      getAnalyticsData(startDate, endDate),
      getPerformanceMetrics(),
    ])

    if (analyticsResult.success && analyticsResult.data) {
      setAnalytics(analyticsResult.data)
    }

    if (performanceResult.success && performanceResult.data) {
      setPerformance(performanceResult.data)
    }

    setLoading(false)
  }

  const loadTrendData = async () => {
    setLoadingTrend(true)
    const days = parseInt(dateRange)
    const result = await getTrendData(selectedMetric, days)

    if (result.success && result.data) {
      setTrendData(result.data)
    }

    setLoadingTrend(false)
  }

  const handleExport = async (format: 'csv' | 'json') => {
    setExporting(true)

    const days = parseInt(dateRange)
    const endDate = new Date()
    const startDate = new Date(endDate.getTime() - days * 24 * 60 * 60 * 1000)

    const result = await exportAnalyticsData(startDate, endDate, format)

    if (result.success && result.data && result.filename) {
      // Create download link
      const blob = new Blob([result.data], {
        type: format === 'csv' ? 'text/csv' : 'application/json',
      })
      const url = window.URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = result.filename
      document.body.appendChild(a)
      a.click()
      document.body.removeChild(a)
      window.URL.revokeObjectURL(url)
    }

    setExporting(false)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading analytics...</p>
        </div>
      </div>
    )
  }

  if (!analytics) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center">
          <p className="text-red-600">Failed to load analytics data</p>
          <Button onClick={loadData} className="mt-4">
            Retry
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Analytics Dashboard</h1>
          <p className="text-gray-600 mt-1">
            Monitor platform performance and user engagement
          </p>
        </div>
        <div className="flex items-center gap-3">
          {/* Date Range Filter */}
          <select
            value={dateRange}
            onChange={(e) => setDateRange(e.target.value as '7' | '30' | '90')}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="7">Last 7 days</option>
            <option value="30">Last 30 days</option>
            <option value="90">Last 90 days</option>
          </select>

          {/* Export Buttons */}
          <Button
            onClick={() => handleExport('csv')}
            disabled={exporting}
            variant="outline"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export CSV
          </Button>
          <Button
            onClick={() => handleExport('json')}
            disabled={exporting}
            variant="outline"
          >
            <svg
              className="h-4 w-4 mr-2"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
              />
            </svg>
            Export JSON
          </Button>
        </div>
      </div>

      {/* Key Performance Indicators */}
      <div>
        <h2 className="text-lg font-semibold mb-4">Key Performance Indicators</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Users</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.kpis.totalUsers}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {analytics.kpis.activeUsers} active
                </p>
              </div>
              <div className="h-12 w-12 bg-blue-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-blue-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Packets</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  {analytics.kpis.totalPackets}
                </p>
                <p className="text-sm text-green-600 mt-1">
                  {analytics.kpis.publishedPackets} published
                </p>
              </div>
              <div className="h-12 w-12 bg-orange-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-orange-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Revenue</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${(analytics.kpis.totalRevenue / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  {analytics.kpis.totalOrders} orders
                </p>
              </div>
              <div className="h-12 w-12 bg-green-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-green-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>

          <Card className="p-6">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">Total Donations</p>
                <p className="text-3xl font-bold text-gray-900 mt-2">
                  ${(analytics.kpis.totalDonations / 100).toFixed(2)}
                </p>
                <p className="text-sm text-gray-500 mt-1">All time</p>
              </div>
              <div className="h-12 w-12 bg-purple-100 rounded-lg flex items-center justify-center">
                <svg
                  className="h-6 w-6 text-purple-600"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                  />
                </svg>
              </div>
            </div>
          </Card>
        </div>
      </div>

      {/* User Engagement Metrics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          User Engagement (Last {dateRange} days)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-5 gap-6">
          <div>
            <p className="text-sm text-gray-600">New Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analytics.userEngagement.newUsers}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Active Users</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analytics.userEngagement.activeUsers}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Assessments Completed</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analytics.userEngagement.assessmentsCompleted}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Packets Generated</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analytics.userEngagement.packetsGenerated}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Tools Used</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analytics.userEngagement.toolsUsed}
            </p>
          </div>
        </div>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Program Enrollment */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Program Enrollment</h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Programs</span>
              <span className="text-2xl font-bold text-gray-900">
                {analytics.programEnrollment.totalPrograms}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Published Programs</span>
              <span className="text-2xl font-bold text-green-600">
                {analytics.programEnrollment.publishedPrograms}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Featured Programs</span>
              <span className="text-2xl font-bold text-blue-600">
                {analytics.programEnrollment.featuredPrograms}
              </span>
            </div>
          </div>
        </Card>

        {/* Donation Metrics */}
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Donation Metrics (Last {dateRange} days)
          </h2>
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Amount</span>
              <span className="text-2xl font-bold text-gray-900">
                ${(analytics.donations.totalAmount / 100).toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Total Donations</span>
              <span className="text-2xl font-bold text-green-600">
                {analytics.donations.totalCount}
              </span>
            </div>
            <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
              <span className="text-gray-700">Gear Drive Submissions</span>
              <span className="text-2xl font-bold text-blue-600">
                {analytics.donations.gearDriveSubmissions}
              </span>
            </div>
          </div>
        </Card>
      </div>

      {/* Order Metrics */}
      <Card className="p-6">
        <h2 className="text-lg font-semibold mb-4">
          Order Metrics (Last {dateRange} days)
        </h2>
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div>
            <p className="text-sm text-gray-600">Total Orders</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              {analytics.orders.totalOrders}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Total Revenue</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${(analytics.orders.totalRevenue / 100).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Average Order Value</p>
            <p className="text-2xl font-bold text-gray-900 mt-1">
              ${(analytics.orders.averageOrderValue / 100).toFixed(2)}
            </p>
          </div>
          <div>
            <p className="text-sm text-gray-600">Pending Orders</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">
              {analytics.orders.pendingOrders}
            </p>
          </div>
        </div>
      </Card>

      {/* Trend Analysis */}
      <Card className="p-6">
        <div className="flex items-center justify-between mb-4">
          <h2 className="text-lg font-semibold">Trend Analysis</h2>
          <select
            value={selectedMetric}
            onChange={(e) => setSelectedMetric(e.target.value)}
            className="px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="users">New Users</option>
            <option value="orders">Orders</option>
            <option value="revenue">Revenue</option>
            <option value="donations">Donations</option>
            <option value="assessments">Assessments</option>
            <option value="packets">Packets</option>
          </select>
        </div>
        {loadingTrend ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          </div>
        ) : (
          <AnalyticsChart
            data={trendData}
            title={`${
              selectedMetric.charAt(0).toUpperCase() + selectedMetric.slice(1)
            } over last ${dateRange} days`}
            color={
              selectedMetric === 'users'
                ? '#3B82F6'
                : selectedMetric === 'orders'
                ? '#10B981'
                : selectedMetric === 'revenue'
                ? '#F59E0B'
                : selectedMetric === 'donations'
                ? '#8B5CF6'
                : selectedMetric === 'assessments'
                ? '#EC4899'
                : '#6366F1'
            }
            valueFormatter={(value) => {
              if (selectedMetric === 'revenue' || selectedMetric === 'donations') {
                return `$${(value / 100).toFixed(0)}`
              }
              return value.toFixed(0)
            }}
          />
        )}
      </Card>

      {/* Performance Monitoring */}
      {performance && (
        <Card className="p-6">
          <h2 className="text-lg font-semibold mb-4">Performance Monitoring</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                Page Load Times (seconds)
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="text-sm font-semibold">
                    {performance.pageLoadTimes.average}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">P50</span>
                  <span className="text-sm font-semibold">
                    {performance.pageLoadTimes.p50}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">P95</span>
                  <span className="text-sm font-semibold">
                    {performance.pageLoadTimes.p95}s
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">P99</span>
                  <span className="text-sm font-semibold">
                    {performance.pageLoadTimes.p99}s
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">Error Rates</h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Total Errors</span>
                  <span className="text-sm font-semibold">
                    {performance.errorRates.total}
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Error Rate</span>
                  <span className="text-sm font-semibold">
                    {(performance.errorRates.rate * 100).toFixed(2)}%
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Last 24h</span>
                  <span className="text-sm font-semibold">
                    {performance.errorRates.last24h}
                  </span>
                </div>
              </div>
            </div>

            <div>
              <h3 className="text-sm font-medium text-gray-600 mb-3">
                API Response Times (ms)
              </h3>
              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">Average</span>
                  <span className="text-sm font-semibold">
                    {performance.apiResponseTimes.average}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">P50</span>
                  <span className="text-sm font-semibold">
                    {performance.apiResponseTimes.p50}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">P95</span>
                  <span className="text-sm font-semibold">
                    {performance.apiResponseTimes.p95}ms
                  </span>
                </div>
                <div className="flex justify-between">
                  <span className="text-sm text-gray-600">P99</span>
                  <span className="text-sm font-semibold">
                    {performance.apiResponseTimes.p99}ms
                  </span>
                </div>
              </div>
            </div>
          </div>

          <div className="mt-6 p-4 bg-green-50 rounded-lg">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="h-3 w-3 rounded-full bg-green-500"></div>
                <span className="font-medium text-gray-900">System Uptime</span>
              </div>
              <span className="text-2xl font-bold text-green-600">
                {performance.uptime.percentage}%
              </span>
            </div>
          </div>
        </Card>
      )}
    </div>
  )
}
