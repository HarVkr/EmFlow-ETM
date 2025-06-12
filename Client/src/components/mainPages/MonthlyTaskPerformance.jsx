"use client"

import React, { useState } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart"
import { Bar, BarChart, Line, LineChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, ComposedChart } from 'recharts'
import { PieChart, BarChart2, Activity, TrendingUp } from 'lucide-react'
import { motion } from 'framer-motion'
import { Button } from "@/components/ui/button"

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
  const [chartType, setChartType] = useState('bar')

  const currentMonth = new Date().toLocaleString('default', { month: 'long' })
  const currentYear = new Date().getFullYear()
  
  const chartVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.5 } }
  }
  
  const totalCompleted = data.reduce((sum, item) => sum + item.completed, 0)
  const totalInProgress = data.reduce((sum, item) => sum + item.inProgress, 0)
  const totalNotStarted = data.reduce((sum, item) => sum + item.notStarted, 0)
  const totalTasks = totalCompleted + totalInProgress + totalNotStarted
  
  const completionRate = totalTasks ? ((totalCompleted / totalTasks) * 100).toFixed(1) : 0

  return (
    <motion.div
      className="w-4/6"
      variants={chartVariants}
      initial="hidden"
      animate="visible"
    >
      <Card className="overflow-hidden border-none shadow-lg">
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-800 to-indigo-600 text-white">
          <div>
            <CardTitle className="text-xl font-bold flex items-center">
              <Activity className="mr-2 h-5 w-5" />
              Task Performance
            </CardTitle>
            <CardDescription className="text-indigo-100">{`${currentMonth} ${currentYear}`}</CardDescription>
          </div>
          <div className="flex space-x-2">
            <div className="flex bg-white/10 rounded-md p-1">
              <Button 
                size="sm" 
                variant={chartType === 'bar' ? 'secondary' : 'ghost'}
                className={`px-2 py-1 ${chartType === 'bar' ? 'bg-white text-indigo-800' : 'text-white'}`}
                onClick={() => setChartType('bar')}
              >
                <BarChart2 className="h-4 w-4" />
              </Button>
              <Button 
                size="sm" 
                variant={chartType === 'line' ? 'secondary' : 'ghost'}
                className={`px-2 py-1 ${chartType === 'line' ? 'bg-white text-indigo-800' : 'text-white'}`}
                onClick={() => setChartType('line')}
              >
                <TrendingUp className="h-4 w-4" />
              </Button>
            </div>
            <Select value={selectedMetric} onValueChange={setSelectedMetric}>
              <SelectTrigger className="w-[140px] bg-white/10 border-0 text-white">
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
        <CardContent className="pt-6 mb-3">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-gradient-to-br from-green-50 to-green-100 p-4 rounded-lg border border-green-200">
              <div className="text-green-800 text-sm font-medium">Completed</div>
              <div className="text-2xl font-bold text-green-900">{totalCompleted}</div>
              <div className="text-green-700 text-xs mt-1">{completionRate}% of total tasks</div>
            </div>
            <div className="bg-gradient-to-br from-yellow-50 to-yellow-100 p-4 rounded-lg border border-yellow-200">
              <div className="text-yellow-800 text-sm font-medium">In Progress</div>
              <div className="text-2xl font-bold text-yellow-900">{totalInProgress}</div>
              <div className="text-yellow-700 text-xs mt-1">{totalTasks ? ((totalInProgress / totalTasks) * 100).toFixed(1) : 0}% of total tasks</div>
            </div>
            <div className="bg-gradient-to-br from-red-50 to-red-100 p-4 rounded-lg border border-red-200">
              <div className="text-red-800 text-sm font-medium">Not Started</div>
              <div className="text-2xl font-bold text-red-900">{totalNotStarted}</div>
              <div className="text-red-700 text-xs mt-1">{totalTasks ? ((totalNotStarted / totalTasks) * 100).toFixed(1) : 0}% of total tasks</div>
            </div>
          </div>
          
          <ChartContainer
            config={{
              completed: {
                label: "Completed",
                color: "#059669",
              },
              inProgress: {
                label: "In Progress",
                color: "#d97706",
              },
              notStarted: {
                label: "Not Started",
                color: "#dc2626",
              },
            }}
            className="h-[350px]"
          >
            <ResponsiveContainer width="100%" height="100%">
              {chartType === 'bar' ? (
                <ComposedChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  {(selectedMetric === 'all' || selectedMetric === 'completed') && (
                    <Bar 
                      dataKey="completed" 
                      fill="#059669" 
                      name="Completed" 
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'inProgress') && (
                    <Bar 
                      dataKey="inProgress" 
                      fill="#d97706" 
                      name="In Progress" 
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'notStarted') && (
                    <Bar 
                      dataKey="notStarted" 
                      fill="#dc2626" 
                      name="Not Started" 
                      radius={[4, 4, 0, 0]}
                    />
                  )}
                  {selectedMetric !== 'all' && (
                    <Line type="monotone" dataKey={selectedMetric} stroke="#4f46e5" name="Trend" strokeWidth={2} />
                  )}
                </ComposedChart>
              ) : (
                <LineChart data={data}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                  <XAxis 
                    dataKey="day" 
                    tick={{ fill: '#6b7280', fontSize: 12 }} 
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <YAxis 
                    tick={{ fill: '#6b7280', fontSize: 12 }}
                    axisLine={{ stroke: '#e5e7eb' }}
                  />
                  <ChartTooltip content={<ChartTooltipContent />} />
                  <Legend 
                    verticalAlign="top" 
                    align="right"
                    wrapperStyle={{ paddingBottom: '10px' }}
                  />
                  {(selectedMetric === 'all' || selectedMetric === 'completed') && (
                    <Line 
                      type="monotone" 
                      dataKey="completed" 
                      stroke="#059669" 
                      name="Completed" 
                      strokeWidth={2}
                      dot={{ fill: '#059669', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'inProgress') && (
                    <Line 
                      type="monotone" 
                      dataKey="inProgress" 
                      stroke="#d97706" 
                      name="In Progress" 
                      strokeWidth={2}
                      dot={{ fill: '#d97706', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                  {(selectedMetric === 'all' || selectedMetric === 'notStarted') && (
                    <Line 
                      type="monotone" 
                      dataKey="notStarted" 
                      stroke="#dc2626" 
                      name="Not Started" 
                      strokeWidth={2}
                      dot={{ fill: '#dc2626', r: 3 }}
                      activeDot={{ r: 5 }}
                    />
                  )}
                </LineChart>
              )}
            </ResponsiveContainer>
          </ChartContainer>
        </CardContent>
      </Card>
    </motion.div>
  )
}