"use client"

import { useEffect, useRef } from 'react'
import { Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js'
import { Line, Bar } from 'react-chartjs-2'

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement
)

interface ChartProps {
  type: 'line' | 'bar'
  data: {
    labels: string[]
    datasets: {
      label: string
      data: number[]
      borderColor?: string
      backgroundColor?: string
      tension?: number
    }[]
  }
  options?: any
}

export function SimpleChart({ type, data, options }: ChartProps) {
  const chartRef = useRef<HTMLCanvasElement>(null)

  const defaultOptions = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: {
        display: false
      }
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: {
          stepSize: 1
        }
      }
    }
  }

  const mergedOptions = { ...defaultOptions, ...options }

  if (type === 'line') {
    return (
      <div className="h-64 w-full">
        <Line data={data} options={mergedOptions} />
      </div>
    )
  }

  if (type === 'bar') {
    return (
      <div className="h-64 w-full">
        <Bar data={data} options={mergedOptions} />
      </div>
    )
  }

  return null
}
