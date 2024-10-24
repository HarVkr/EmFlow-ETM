import React, { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"

const fetchAttendanceData = async (month) => {
    // Simulating API delay
    await new Promise(resolve => setTimeout(resolve, 500))

    // Mock data
    const data = {}
    const daysInMonth = eachDayOfInterval({ start: startOfMonth(month), end: endOfMonth(month) })
    daysInMonth.forEach(day => {
        const rand = Math.random()
        if (rand > 0.9) data[format(day, 'yyyy-MM-dd')] = 'absent'
        else if (rand > 0.8) data[format(day, 'yyyy-MM-dd')] = 'late'
        else data[format(day, 'yyyy-MM-dd')] = 'present'
    })
    return data
}

export default function MyAttendance() {
    const [currentMonth, setCurrentMonth] = useState(new Date())
    const [attendanceData, setAttendanceData] = useState({})
    const [isLoading, setIsLoading] = useState(true)

    useEffect(() => {
        const loadAttendanceData = async () => {
            setIsLoading(true)
            const data = await fetchAttendanceData(currentMonth)
            setAttendanceData(data)
            setIsLoading(false)
        }
        loadAttendanceData()
    }, [currentMonth])

    const days = eachDayOfInterval({
        start: startOfMonth(currentMonth),
        end: endOfMonth(currentMonth),
    })

    const nextMonth = () => setCurrentMonth(addMonths(currentMonth, 1))
    const prevMonth = () => setCurrentMonth(subMonths(currentMonth, 1))

    const getAttendanceColor = (status) => {
        switch (status) {
            case 'present': return 'bg-indigo-800'
            case 'absent': return 'bg-red-500'
            case 'late': return 'bg-indigo-500'
            default: return 'bg-gray-300'
        }
    }

    const calculateStatistics = () => {
        let present = 0, absent = 0, late = 0
        Object.values(attendanceData).forEach(status => {
            if (status === 'present') present++
            else if (status === 'absent') absent++
            else if (status === 'late') late++
        })
        const total = present + absent + late
        const attendancePercentage = total > 0 ? ((present + late) / total * 100).toFixed(2) : '0.00'
        return { present, absent, late, attendancePercentage }
    }

    const stats = calculateStatistics()

    return (
        <div className=' scale-100'>
            <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                    <CardTitle className="text-xl font-bold text-black">My Attendance</CardTitle>
                    <div className="flex items-center space-x-2 ml-28">
                        <Button variant="outline" className="h-6 w-4" onClick={prevMonth}>
                            <ChevronLeft className="h-2 w-2" />
                        </Button>
                        <span className=" text-base font-semibold text-black">
                            {format(currentMonth, 'MMMM yyyy')}
                        </span>
                        <Button variant="outline" className="h-6 w-4" onClick={nextMonth}>
                            <ChevronRight className="h-2 w-2" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                        <div className="flex justify-center items-center h-64">
                            <span className="loading loading-spinner loading-lg"></span>
                        </div>
                    ) : (
                        <>
                            <div className="grid grid-cols-7 gap-2 mb-2">
                                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
                                    <div key={day} className="text-center font-semibold text-sm mt-2">
                                        {day}
                                    </div>
                                ))}
                                {days.map(day => (
                                    <div
                                        key={day.toString()}
                                        className={`
                    aspect-square flex items-center justify-center text-xs text-white font-semibold rounded-2xl
                    ${!isSameMonth(day, currentMonth) && 'text-white'}
                    ${isToday(day) && 'ring-2 ring-black-'}
                    ${getAttendanceColor(attendanceData[format(day, 'yyyy-MM-dd')] || 'no-data')}
                  `}
                                    >
                                        {format(day, 'd')}
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between items-start mt-6">
                                <div>
                                    <h4 className="text-base font-semibold mb-2">Monthly Statistics</h4>
                                    <div className="space-y-1">
                                        <div>Present: {stats.present} days</div>
                                        <div>Absent: {stats.absent} days</div>
                                        <div>Late: {stats.late} days</div>
                                        <div>Attendance: {stats.attendancePercentage}%</div>
                                    </div>
                                </div>
                                <div>
                                    <h4 className="text-base font-semibold mb-2">Legend</h4>
                                    <div className="space-y-2">
                                        <Badge variant="secondary" className="bg-indigo-800 text-white p-2">Present</Badge>
                                        <Badge variant="secondary" className="bg-red-500 text-white p-2">Absent</Badge>
                                        <Badge variant="secondary" className="bg-indigo-500 text-white p-2">Late</Badge>
                                    </div>
                                </div>
                            </div>
                        </>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}