import React, { useState, useEffect } from 'react'
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isToday, addMonths, subMonths } from 'date-fns'
import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { motion } from 'framer-motion'
import { Calendar, Clock, CheckCircle2, XCircle } from 'lucide-react'
import { PieChart, BarChart2, Activity, TrendingUp } from 'lucide-react'
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
            case 'present': return 'bg-indigo-600'
            case 'absent': return 'bg-red-500'
            case 'late': return 'bg-amber-500'
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

    const cardVariants = {
        hidden: { opacity: 0, y: 20 },
        visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
    }

    return (
//         <motion.div
//             className='w-full scale-100'
//             variants={cardVariants}
//             initial="hidden"
//             animate="visible"
//         >
//             <Card className="overflow-hidden border-none shadow-lg max-w-4xl mx-auto">
//                 <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-600 to-indigo-800 text-white">
//                     <div className="flex items-center">
//                         <Calendar className="h-5 w-5 mr-2" />
//                         <CardTitle className="text-xl font-bold">Attendance Record</CardTitle>
//                     </div>
//                     <div className="flex items-center space-x-2">
//                         <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-indigo-700" onClick={prevMonth}>
//                             <ChevronLeft className="h-4 w-4" />
//                         </Button>
//                         <span className="text-base font-semibold">
//                             {format(currentMonth, 'MMMM yyyy')}
//                         </span>
//                         <Button variant="ghost" className="h-8 w-8 p-0 text-white hover:bg-indigo-700" onClick={nextMonth}>
//                             <ChevronRight className="h-4 w-4" />
//                         </Button>
//                     </div>
//                 </CardHeader>
//                 <CardContent className="pt-4">
//                     {isLoading ? (
//                         <div className="flex justify-center items-center h-48">
//                             <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600"></div>
//                         </div>
//                     ) : (
//                         <>
//                             <div className="grid grid-cols-7 gap-1 mb-3">
//                                 {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
//                                     <div key={day} className="text-center font-medium text-xs text-gray-600">
//                                         {day}
//                                     </div>
//                                 ))}
//                                 {days.map(day => {
//                                     const status = attendanceData[format(day, 'yyyy-MM-dd')] || 'no-data';
//                                     return (
//                                         <motion.div
//                                             key={day.toString()}
//                                             className={`
//                                                 aspect-square flex items-center justify-center text-xs 
//                                                 text-white font-medium rounded-md
//                                                 ${!isSameMonth(day, currentMonth) && 'opacity-40'}
//                                                 ${isToday(day) && 'ring-1 ring-indigo-300'}
//                                                 ${getAttendanceColor(status)}
//                                             `}
//                                             whileHover={{ scale: 1.1 }}
//                                             transition={{ type: 'spring', stiffness: 400, damping: 10 }}
//                                         >
//                                             {format(day, 'd')}
//                                         </motion.div>
//                                     );
//                                 })}
//                             </div>
                            
//                             <div className="flex flex-row justify-between gap-4 mt-4 px-1 text-sm"> {/* Smaller text and spacing */}
//                                 <div className="space-y-1">
//                                     <h4 className="font-semibold text-gray-800 flex items-center text-sm"> {/* Smaller heading */}
//                                         <Clock className="h-3 w-3 mr-1 text-indigo-600" />
//                                         Monthly Statistics
//                                     </h4>
//                                     <div className="grid grid-cols-2 gap-1 text-xs"> {/* Smaller grid */}
//                                         <div className="bg-indigo-50 p-1.5 rounded-md"> {/* Less padding */}
//                                             <div className="font-semibold text-indigo-800">Present</div>
//                                             <div className="font-bold text-indigo-600 flex items-center">
//                                                 <CheckCircle2 className="h-3 w-3 mr-1" />
//                                                 {stats.present} days
//                                             </div>
//                                         </div>
//                                         <div className="bg-red-50 p-1.5 rounded-md">
//                                             <div className="font-semibold text-red-800">Absent</div>
//                                             <div className="font-bold text-red-600 flex items-center">
//                                                 <XCircle className="h-3 w-3 mr-1" />
//                                                 {stats.absent} days
//                                             </div>
//                                         </div>
//                                         <div className="bg-amber-50 p-1.5 rounded-md">
//                                             <div className="font-semibold text-amber-800">Late</div>
//                                             <div className="font-bold text-amber-600">{stats.late} days</div>
//                                         </div>
//                                         <div className="bg-emerald-50 p-1.5 rounded-md">
//                                             <div className="font-semibold text-emerald-800">Attendance</div>
//                                             <div className="font-bold text-emerald-600">{stats.attendancePercentage}%</div>
//                                         </div>
//                                     </div>
//                                 </div>
                                
//                                 <div className="space-y-1 text-xs"> {/* Reduced spacing, smaller text */}
//                                     <h4 className="font-semibold text-gray-800 text-sm">Legend</h4>
//                                     <div className="flex flex-col space-y-1">
//                                         <div className="flex items-center">
//                                             <div className="w-3 h-3 rounded bg-indigo-600 mr-1"></div>
//                                             <span>Present</span>
//                                         </div>
//                                         <div className="flex items-center">
//                                             <div className="w-3 h-3 rounded bg-amber-500 mr-1"></div>
//                                             <span>Late</span>
//                                         </div>
//                                         <div className="flex items-center">
//                                             <div className="w-3 h-3 rounded bg-red-500 mr-1"></div>
//                                             <span>Absent</span>
//                                         </div>
//                                     </div>
//                                 </div>
//                             </div>
//                         </>
//                     )}
//                 </CardContent>
//             </Card>
//         </motion.div>
//     )
// }
        
        <motion.div className="w-4/12">
            <Card className="overflow-hidden border-none shadow-lg">
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2 bg-gradient-to-r from-indigo-800 to-indigo-600 text-white">
                    <div>
                        <CardTitle className="text-xl font-bold flex items-center text-white">
                                        <Calendar className="h-5 w-5 mr-2" />
                                        My Attendance
                        </CardTitle>
                        <CardDescription className="text-indigo-100">{format(currentMonth, 'MMMM yyyy')}</CardDescription>
                    </div>
                    <div className="flex items-center space-x-2">
                        <Button variant="outline" className="h-6 w-4 bg-white text-indigo-800" onClick={prevMonth}>
                            <ChevronLeft className="h-2 w-2" />
                        </Button>
                        <span className=" text-base font-semibold text-white">
                            {format(currentMonth, 'MMMM yyyy')}
                        </span>
                        <Button variant="outline" className="h-6 w-4 bg-white text-indigo-800" onClick={nextMonth}>
                            <ChevronRight className="h-2 w-2" />
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="pt-6 px-4">
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
        </motion.div>
    )
}
