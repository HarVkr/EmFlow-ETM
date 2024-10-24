import { useState } from 'react'
import { Clock, PlayCircle, CheckCircle2, XCircle } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Progress } from "@/components/ui/progress"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Slider } from "@/components/ui/slider"
import { useContext, useMemo, useEffect, useCallback } from 'react'
import GlobalState from '../../../GlobalState'
import ManagerAPI from '@/api/ManagerAPI'
import UserAPI from '@/api/UserAPI'
import TaskAPI from '@/api/TaskAPI'
const mockTasks = [
  {
    id: 1,
    taskName: "Update Documentation",
    taskID: "DOC-001",
    taskDescription: "Review and update all project documentation to reflect recent changes.",
    taskDeadline: "2024-10-22T10:00:00",
    creationDate: "2024-10-15T09:00:00",
    employeeIDs: ["EMP001", "EMP002", "MGR001"],
    managerID: "MGR001",
    status: "In Progress",
    progress: 60
  },
  {
    id: 2,
    taskName: "Prepare Project Status Report",
    taskID: "REP-001",
    taskDescription: "Compile and analyze project metrics for the monthly status report.",
    taskDeadline: "2024-10-22T12:00:00",
    creationDate: "2024-10-16T11:00:00",
    employeeIDs: ["EMP003", "MGR001"],
    managerID: "MGR001",
    status: "Not Started",
    progress: 0
  },
  {
    id: 3,
    taskName: "Code Review",
    taskID: "DEV-001",
    taskDescription: "Perform a comprehensive code review for the new feature implementation.",
    taskDeadline: "2024-10-22T17:00:00",
    creationDate: "2024-10-17T14:00:00",
    employeeIDs: ["EMP004", "EMP005", "MGR001"],
    managerID: "MGR001",
    status: "Completed",
    progress: 100
  }
]

const statusColors = {
  "Not Started": "bg-red-100 text-red-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  "Completed": "bg-green-100 text-green-800"
}

export default function Component() {
  const [tasks, setTasks] = useState([]);
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [employeeNames, setEmployeeNames] = useState([]);
  const [unsavedChanges, setUnsavedChanges] = useState({});
  const { getTasks, updateTaskStatus } = useMemo(() => TaskAPI(token), [token]);
  const { getEmployeeNamebyID } = useMemo(() => UserAPI(token), [token]);

  const fetchTasks = useCallback(async () => {
    try {
      const fetchedTasks = await getTasks();
      setTasks(fetchedTasks);
    } catch (error) {
      console.error("Error fetching assigned tasks:", error);
    }
  }, [getTasks]);

  useEffect(() => {
    fetchTasks();
  }, [fetchTasks]);


  // useEffect(() => {
  //     const fetchTasks = async () => {
  //         try {
  //             const tasks = await getTasks();
  //             setTasks(tasks);
  //         } catch (error) {
  //             console.error("Error fetching assigned tasks:", error);
  //         }
  //     };

  //     fetchTasks();
  // }, [getTasks]);
  // console.log(tasks);

  // const fetchEmployeeNamesForTasks = async (tasks) => {
  //     try {
  //         const tasksWithEmployeeNames = await Promise.all(tasks.map(async (task) => {
  //             const employeeNames = await Promise.all(task.employeeIDs.map(async (employeeID) => {
  //                 const employeeName = await getEmployeeNamebyID(employeeID);
  //                 return employeeName;
  //             }));
  //             return { ...task, employeeNames };
  //         }));
  //         return tasksWithEmployeeNames;
  //     } catch (error) {
  //         console.error("Error fetching employee names for tasks:", error);
  //         return tasks;
  //     }
  // };
  // const fetchEmployeeNamesForTasks = useCallback(async (tasksToFetch) => {
  //   try {
  //       const tasksWithEmployeeNames = await Promise.all(tasksToFetch.map(async (task) => {
  //           const employeeNames = await Promise.all(task.employeeIDs.map(async (employeeID) => {
  //               const employeeName = await getEmployeeNamebyID(employeeID);
  //               return employeeName.userID;
  //           }));
  //           return { ...task, employeeNames };
  //       }));
  //       return tasksWithEmployeeNames;
  //   } catch (error) {
  //       console.error("Error fetching employee names for tasks:", error);
  //       return tasksToFetch;
  //   }
  // }, [getEmployeeNamebyID]);

  // useEffect(() => {
  //   if (tasks.length > 0) {
  //       fetchEmployeeNamesForTasks(tasks).then(updatedTasks => {
  //           setTasks(updatedTasks);
  //       });
  //   }
  // }, [fetchEmployeeNamesForTasks, tasks.length]);

  // useEffect(() => {
  //     const fetchTasksWithEmployeeNames = async () => {
  //         const tasksWithEmployeeNames = await fetchEmployeeNamesForTasks(tasks);
  //         setTasks(tasksWithEmployeeNames);
  //     };

  //     if (tasks.length > 0) {
  //         fetchTasksWithEmployeeNames();
  //     }
  //   }, [tasks]);


  //console.log(tasks);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleProgressChange = (taskId, newProgress) => {
    // setTasks(tasks.map(task => {
    //   if (task._id === taskId) {
    //     let newStatus = task.status
    //     if (newProgress === 0) newStatus = "Not Started"
    //     else if (newProgress < 100) newStatus = "In Progress"
    //     else if (newProgress === 100) newStatus = "Completed"
    //     return { ...task, progress: newProgress, status: newStatus }
    //   }
    //   return task
    // }))
    let newStatus = "Not Started";
    if (newProgress > 0 && newProgress < 100) newStatus = "In Progress";
    else if (newProgress === 100) newStatus = "Completed";

    setUnsavedChanges(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        progress: newProgress,
        status: newStatus
      }
    }));
  }

  const handleStatusChange = async (taskId, newStatus) => {
    // let newProgress = 0;
    // if (newStatus === "In Progress") {
    //   newProgress = 1;
    // } else if (newStatus === "Completed") {
    //   newProgress = 100;
    // }

    // try {
    //   // Update local state
    //   setTasks(tasks.map(task => {
    //     if (task._id === taskId) {
    //       return { ...task, status: newStatus, progress: newProgress }
    //     }
    //     return task
    //   }));
    let newProgress = 0;
    if (newStatus === "In Progress") newProgress = 1;
    else if (newStatus === "Completed") newProgress = 100;

    setUnsavedChanges(prev => ({
      ...prev,
      [taskId]: {
        ...prev[taskId],
        status: newStatus,
        progress: newProgress
      }
    }));

    // Send update to backend
    //   await updateTaskStatus(taskId, {
    //     status: newStatus,
    //   });
    //   console.log("Task updated successfully");
    // } catch (error) {
    //   console.error("Error updating task:", error);
    //   // Revert local state if backend update fails
    //   fetchTasks();
    // }  
    // setTasks(tasks.map(task => {
    //   if (task._id === taskId) {
    //     let newProgress = task.progress
    //     if (newStatus === "Not Started") newProgress = 0
    //     else if (newStatus === "In Progress" && task.status === "Not Started") newProgress = 1
    //     else if (newStatus === "Completed") newProgress = 100
    //     return { ...task, status: newStatus, progress: newProgress }
    //   }
    //   return task
    // }))
  }
  const saveChanges = async (taskId) => {
    if (!unsavedChanges[taskId]) return;

    try {
      await updateTaskStatus(taskId, {
        status: unsavedChanges[taskId].status,
        progress: unsavedChanges[taskId].progress
      });

      // Update local state
      setTasks(tasks.map(task => {
        if (task._id === taskId) {
          return {
            ...task,
            status: unsavedChanges[taskId].status,
            progress: unsavedChanges[taskId].progress
          };
        }
        return task;
      }));

      // Clear unsaved changes for this task
      setUnsavedChanges(prev => {
        const newChanges = { ...prev };
        delete newChanges[taskId];
        return newChanges;
      });

      console.log("Task updated successfully");
    } catch (error) {
      console.error("Error updating task:", error);
      fetchTasks(); // Revert to server state if save fails
    }
  }

  return (
    <div className="container mx-auto p-8 pb-4 pt-7">
      <h1 className="text-xl font-bold mb-4 text-indigo-700 ml-1">Update your Tasks</h1>
      <div className="space-y-4">
        {tasks.map((task) => (
          <Card key={task._id} className="w-full">
            <CardHeader className="pb-2">
              <div className="flex justify-between items-start">
                <div>
                  <CardTitle className="text-lg mb-1">{task.taskName}</CardTitle>
                  <CardDescription>
                    <span className="flex items-center">
                      <Clock className="mr-1 h-3 w-3" />
                      Due: {formatDate(task.taskDeadline)}
                    </span>
                  </CardDescription>
                </div>
                <Badge className={statusColors[task.status]}>{task.status}</Badge>
              </div>
            </CardHeader>
            <CardContent>
              {/* <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className=" text-base font-medium">Progress:</span>
                  <span className="text-base font-medium">{task.progress}%</span>
                </div>
                <Slider
                  value={[task.progress]}
                  onValueChange={(value) => handleProgressChange(task._id, value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div> */}
              <div className="space-y-2 mt-2">
                <div className="flex items-center justify-between">
                  <span className="text-base font-medium">Progress:</span>
                  <span className="text-base font-medium">
                    {(unsavedChanges[task._id]?.progress ?? task.progress)}%
                  </span>
                </div>
                <Slider
                  value={[unsavedChanges[task._id]?.progress ?? task.progress]}
                  onValueChange={(value) => handleProgressChange(task._id, value[0])}
                  max={100}
                  step={1}
                  className="w-full"
                />
              </div>
              <div className="flex justify-between items-center mt-4">
                {/* <div className="flex -space-x-2">
                  {task.employeeIDs.map((emp, index) => (
                    <Avatar key={index} className="border-2 border-white">
                      <AvatarFallback>{emp.slice(0, 2).toUpperCase()}</AvatarFallback>
                    </Avatar>
                  ))}
                </div> */}
                <Dialog>
                  <DialogTrigger asChild>
                    <Button variant="outline" size="sm">View Details</Button>
                  </DialogTrigger>
                  <DialogContent>
                    <DialogHeader>
                      <DialogTitle>{task.taskName}</DialogTitle>
                    </DialogHeader>
                    <div className="space-y-4">
                      <p><strong>Task ID:</strong> {task.taskID}</p>
                      <p><strong>Description:</strong> {task.taskDescription}</p>
                      <p><strong>Deadline:</strong> {formatDate(task.taskDeadline)}</p>
                      <p><strong>Created:</strong> {formatDate(task.creationDate)}</p>
                      <p><strong>Assigned to:</strong> {task.employeeIDs.join(', ')}</p>
                      <p><strong>Manager ID:</strong> {task.managerID}</p>
                      <div>
                        <strong>Status:</strong>
                        <Badge className={statusColors[unsavedChanges[task._id]?.status ?? task.status]}>
                          {unsavedChanges[task._id]?.status ?? task.status}
                        </Badge>
                      </div>
                      <div>
                        <strong>Progress:</strong>
                        <div className="flex items-center space-x-2 mt-2">
                          <Progress value={task.progress} className="w-full" />
                          <span className="text-sm font-medium">{task.progress}%</span>
                        </div>
                      </div>
                    </div>
                  </DialogContent>
                </Dialog>
              </div>
            </CardContent>
            <CardFooter className="flex justify-between pt-2">
              <div className="flex space-x-2">
                <Button
                  size="sm"
                  className={task.status === "Not Started" ? "bg-indigo-700" : " border-2 border-indigo-700 bg-white text-indigo-700"}
                  onClick={() => handleStatusChange(task._id, "Not Started")}
                >
                  <XCircle className="mr-1 h-4 w-4" />
                  Not Started
                </Button>
                <Button
                  size="sm"
                  className={task.status === "In Progress" ? "bg-indigo-700" : "border-2 border-indigo-700 bg-white text-indigo-700"}
                  onClick={() => handleStatusChange(task._id, "In Progress")}
                >
                  <PlayCircle className="mr-1 h-4 w-4" />
                  In Progress
                </Button>
                <Button
                  size="sm"
                  className={task.status === "Completed" ? "bg-indigo-700" : "border-2 border-indigo-700 bg-white text-indigo-700"}
                  onClick={() => handleStatusChange(task._id, "Completed")}
                >
                  <CheckCircle2 className="mr-1 h-4 w-4" />
                  Completed
                </Button>
              </div>
              {unsavedChanges[task._id] && (
                <Button
                  size="sm"
                  className="bg-indigo-500 text-white hover:bg-indigo-700"
                  onClick={() => saveChanges(task._id)}
                >
                  Save Changes
                </Button>
              )}
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  )
}