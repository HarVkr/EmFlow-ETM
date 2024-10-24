"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'

// Mock data for the current month
const generateMockData = () => {
  const data = []
  const currentDate = new Date()
  const daysInMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 0).getDate()

  for (let i = 1; i <= daysInMonth; i++) {
    data.push({
      day: i,
      completed: Math.floor(Math.random() * 10),
      inProgress: Math.floor(Math.random() * 15),
      notStarted: Math.floor(Math.random() * 8),
    })
  }
  return data
}

export default function MonthlyTaskPerformance() {
  const [data] = useState(generateMockData())
  const [selectedMetric, setSelectedMetric] = useState('all')

  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()

  return (
    <Card className="w-auto h-auto">
      <CardHeader>
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl font-bold">Monthly Task Performance Overview</CardTitle>
            <CardDescription>{`${currentMonth} ${currentYear}`}</CardDescription>
          </div>
          <Select value={selectedMetric} onValueChange={setSelectedMetric}>
            <SelectTrigger className="w-[180px]">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Metrics</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="inProgress">In Progress</SelectItem>
              <SelectItem value="notStarted">Not Started</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </CardHeader>
      <CardContent>
        <ChartContainer
          config={{
            completed: {
              label: "Completed",
              color: "hsl(var(--chart-1))",
            },
            inProgress: {
              label: "In Progress",
              color: "hsl(var(--chart-2))",
            },
            notStarted: {
              label: "Not Started",
              color: "hsl(var(--chart-3))",
            },
          }}
          className="h-[400px]"
        >
          <ResponsiveContainer width="100%" height="100%">
            <ComposedChart data={data}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="day" />
              <YAxis />
              <ChartTooltip content={<ChartTooltipContent />} />
              <Legend />
              {(selectedMetric === 'all' || selectedMetric === 'completed') && (
                <Bar dataKey="completed" fill="#000000" name="Completed" />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'inProgress') && (
                <Bar dataKey="inProgress" fill="#4338ca" name="In Progress" />
              )}
              {(selectedMetric === 'all' || selectedMetric === 'notStarted') && (
                <Bar dataKey="notStarted" fill="#ef4444" name="Not Started" />
              )}
              {selectedMetric !== 'all' && (
                <Line type="monotone" dataKey={selectedMetric} stroke="#8884d8" name="Trend" />
              )}
            </ComposedChart>
          </ResponsiveContainer>
        </ChartContainer>
      </CardContent>
    </Card>
  )
}