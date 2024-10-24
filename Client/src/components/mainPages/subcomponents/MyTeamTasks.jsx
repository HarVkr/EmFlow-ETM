import { useState } from 'react'
import { ChevronDown, ChevronUp, Clock, Users } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import React, { useContext, useEffect, useMemo } from 'react'
import GlobalState from '../../../GlobalState'
import UserAPI from '@/api/UserAPI'

const mockTasks = [
    {
        id: 1,
        taskName: "Update Documentation",
        taskDeadline: "2024-10-22T10:00:00",
        taskStatus: "In Progress",
        employeeIDs: ["EMP001", "EMP002", "EMP003"],
        taskDescription: "Review and update all project documentation to reflect recent changes."
    },
    {
        id: 2,
        taskName: "Prepare Project Status Report",
        taskDeadline: "2024-10-22T12:00:00",
        taskStatus: "Not Started",
        employeeIDs: ["EMP004", "EMP005"],
        taskDescription: "Compile and analyze project metrics for the monthly status report."
    },
    {
        id: 3,
        taskName: "Code Review",
        taskDeadline: "2024-10-22T17:00:00",
        taskStatus: "Completed",
        employeeIDs: ["EMP001", "EMP003", "EMP006"],
        taskDescription: "Perform a comprehensive code review for the new feature implementation."
    },
    {
        id: 4,
        taskName: "Client Presentation Prep",
        taskDeadline: "2024-10-23T09:00:00",
        taskStatus: "In Progress",
        employeeIDs: ["EMP002", "EMP004", "EMP005"],
        taskDescription: "Prepare slides and talking points for the upcoming client presentation."
    },
    {
        id: 5,
        taskName: "Team Building Activity Planning",
        taskDeadline: "2024-10-24T14:00:00",
        taskStatus: "Not Started",
        employeeIDs: ["EMP001", "EMP002", "EMP003", "EMP004", "EMP005", "EMP006"],
        taskDescription: "Plan and organize the quarterly team building activity."
    }
]

const statusColors = {
    "Not Started": "bg-red-100 text-red-800",
    "In Progress": "bg-yellow-100 text-yellow-800",
    "Completed": "bg-green-100 text-green-800"
}

export default function Component() {
    const state = useContext(GlobalState);
    const [tasks, setTasks] = useState([]);
    const [expandedTask, setExpandedTask] = useState(null);
    const token = state.token[0];
    //console.log("Token in EmDashboard: ", token);
    const teamID = state.teamID[0];
    console.log(teamID);

    const { getTeamTasks } = useMemo(() => UserAPI(token), [token]);

    useEffect(() => {
        if (teamID) {
            const fetchTeamTasks = async () => {
                try {
                    const teamTasks = await getTeamTasks(teamID);
                    setTasks(teamTasks);
                    console.log("Team Tasks: ", teamTasks);
                }
                catch (err) {
                    console.error("Error getting team tasks: ", err);
                }
            };
            fetchTeamTasks();
        }
    }, [teamID, getTeamTasks]);



    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        })
    }

    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="text-xl font-bold text-indigo-700">My Team Tasks</CardTitle>
                <CardDescription className="text-base">View tasks assigned to your team</CardDescription>
            </CardHeader>
            <CardContent>
                <Table>
                    <TableHeader>
                        <TableRow className="text-base">
                            <TableHead>Task Name</TableHead>
                            <TableHead>Deadline</TableHead>
                            <TableHead>Status</TableHead>
                            <TableHead>Assigned To</TableHead>
                            <TableHead className="text-right">View Details</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {tasks.map((task) => (
                            // Key is now on the outermost fragment
                            <React.Fragment key={task._id}>
                                <TableRow className=" text-base">
                                    <TableCell className="font-medium">{task.taskName}</TableCell>
                                    <TableCell>
                                        <div className="flex items-center">
                                            <Clock className="mr-2 h-4 w-4 text-muted-foreground" />
                                            {formatDate(task.taskDeadline)}
                                        </div>
                                    </TableCell>
                                    <TableCell>
                                        <Badge className={statusColors[task.status]}>{task.status}</Badge>
                                    </TableCell>
                                    <TableCell>
                                        <div className="flex -space-x-2">
                                            {task.employeeIDs.map((emp, index) => (
                                                <Avatar key={emp._id} className="border-2 border-background">
                                                    <AvatarFallback>{emp.userID ? emp.userID.slice(0, 2).toUpperCase() : 'U'}</AvatarFallback>
                                                </Avatar>
                                            ))}
                                            {task.employeeIDs.length > 3 && (
                                                <Avatar className="border-2 border-background">
                                                    <AvatarFallback>+{task.employeeIDs.length - 3}</AvatarFallback>
                                                </Avatar>
                                            )}
                                        </div>
                                    </TableCell>
                                    <TableCell className="text-right">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => setExpandedTask(expandedTask === task._id ? null : task._id)}
                                        >
                                            {expandedTask === task._id ? (
                                                <ChevronUp className="h-4 w-4" />
                                            ) : (
                                                <ChevronDown className="h-4 w-4" />
                                            )}
                                            <span className="sr-only">Toggle details</span>
                                        </Button>
                                    </TableCell>
                                </TableRow>
                                {expandedTask === task._id && (
                                    <TableRow>
                                        <TableCell colSpan={6}>
                                            {/* <div className="p-4 bg-muted rounded-md space-y-2">
                                                <p><strong>Description:</strong> {task.taskDescription}</p>
                                                <div>
                                                    <strong>Assigned to:</strong>
                                                    <div className="flex flex-wrap gap-2 mt-2">
                                                        {task.employeeIDs.map((emp) => (
                                                            <Badge key={emp._id} variant="secondary">
                                                                {emp.userID || emp}
                                                            </Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div> */}
                                            <div className="p-4 bg-muted rounded-md space-y-2">
                                                <p><strong>Description:</strong> {task.taskDescription}</p>
                                                <p><strong>Created:</strong> {formatDate(task.creationDate)}</p>
                                                <div>
                                                    <strong>Assigned to:</strong>
                                                    <div className="flex flex-wrap gap-2 mt-1">
                                                        {task.employeeIDs.map((emp) => (
                                                            <Badge key={emp._id} variant="secondary">{emp.userID || emp}</Badge>
                                                        ))}
                                                    </div>
                                                </div>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                )}
                            </React.Fragment>
                        ))}
                    </TableBody>
                </Table>
            </CardContent>
        </Card>
    )
}