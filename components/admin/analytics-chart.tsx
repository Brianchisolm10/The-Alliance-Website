'use client'

import { useEffect, useRef } from 'react'

interface DataPoint {
  date: string
  value: number
}

interface AnalyticsChartProps {
  data: DataPoint[]
  title: string
  color?: string
  valueFormatter?: (value: number) => string
}

export function AnalyticsChart({
  data,
  title,
  color = '#3B82F6',
  valueFormatter = (value) => value.toString(),
}: AnalyticsChartProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    if (!canvasRef.current || data.length === 0) return

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Set canvas size
    const dpr = window.devicePixelRatio || 1
    const rect = canvas.getBoundingClientRect()
    canvas.width = rect.width * dpr
    canvas.height = rect.height * dpr
    ctx.scale(dpr, dpr)

    // Clear canvas
    ctx.clearRect(0, 0, rect.width, rect.height)

    // Calculate dimensions
    const padding = { top: 20, right: 20, bottom: 40, left: 50 }
    const chartWidth = rect.width - padding.left - padding.right
    const chartHeight = rect.height - padding.top - padding.bottom

    // Find min and max values
    const values = data.map((d) => d.value)
    const maxValue = Math.max(...values, 1)
    const minValue = Math.min(...values, 0)
    const valueRange = maxValue - minValue || 1

    // Draw grid lines
    ctx.strokeStyle = '#E5E7EB'
    ctx.lineWidth = 1
    const gridLines = 5
    for (let i = 0; i <= gridLines; i++) {
      const y = padding.top + (chartHeight / gridLines) * i
      ctx.beginPath()
      ctx.moveTo(padding.left, y)
      ctx.lineTo(padding.left + chartWidth, y)
      ctx.stroke()

      // Draw y-axis labels
      const value = maxValue - (valueRange / gridLines) * i
      ctx.fillStyle = '#6B7280'
      ctx.font = '12px sans-serif'
      ctx.textAlign = 'right'
      ctx.fillText(valueFormatter(value), padding.left - 10, y + 4)
    }

    // Draw line chart
    ctx.strokeStyle = color
    ctx.lineWidth = 2
    ctx.beginPath()

    data.forEach((point, index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      const normalizedValue = (point.value - minValue) / valueRange
      const y = padding.top + chartHeight - normalizedValue * chartHeight

      if (index === 0) {
        ctx.moveTo(x, y)
      } else {
        ctx.lineTo(x, y)
      }
    })

    ctx.stroke()

    // Draw area under line
    ctx.lineTo(padding.left + chartWidth, padding.top + chartHeight)
    ctx.lineTo(padding.left, padding.top + chartHeight)
    ctx.closePath()
    ctx.fillStyle = color + '20'
    ctx.fill()

    // Draw data points
    ctx.fillStyle = color
    data.forEach((point, index) => {
      const x = padding.left + (chartWidth / (data.length - 1)) * index
      const normalizedValue = (point.value - minValue) / valueRange
      const y = padding.top + chartHeight - normalizedValue * chartHeight

      ctx.beginPath()
      ctx.arc(x, y, 4, 0, 2 * Math.PI)
      ctx.fill()
    })

    // Draw x-axis labels (show every nth label to avoid crowding)
    const labelInterval = Math.ceil(data.length / 7)
    ctx.fillStyle = '#6B7280'
    ctx.font = '12px sans-serif'
    ctx.textAlign = 'center'
    data.forEach((point, index) => {
      if (index % labelInterval === 0 || index === data.length - 1) {
        const x = padding.left + (chartWidth / (data.length - 1)) * index
        const date = new Date(point.date)
        const label = `${date.getMonth() + 1}/${date.getDate()}`
        ctx.fillText(label, x, padding.top + chartHeight + 20)
      }
    })
  }, [data, color, valueFormatter])

  if (data.length === 0) {
    return (
      <div className="flex items-center justify-center h-64 text-gray-500">
        No data available
      </div>
    )
  }

  return (
    <div className="space-y-2">
      <h3 className="text-sm font-medium text-gray-700">{title}</h3>
      <canvas
        ref={canvasRef}
        className="w-full h-64"
        style={{ width: '100%', height: '256px' }}
      />
    </div>
  )
}
