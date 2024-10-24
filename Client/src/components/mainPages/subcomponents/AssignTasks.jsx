import { useState } from 'react'
import { Plus, X } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, ChevronUp, Clock, Users, AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import ManagerAPI from '@/api/ManagerAPI'
import UserAPI from '@/api/UserAPI'
import TaskAPI from '@/api/TaskAPI'
import { useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import { useContext, useMemo } from 'react'
import api from '../../../utils/axios'
// Mock data for demonstration purposes

const mockTasks = [
  { id: 1, name: "Update Documentation", deadline: "Today before 10:00 am" },
  { id: 2, name: "Prepare Project Status Report", deadline: "Today before 12:00 pm" },
]

const mockEmployees = [
  { id: 1, name: "John Doe" },
  { id: 2, name: "Jane Smith" },
  { id: 3, name: "Bob Johnson" },
]
const statusColors = {
  "Not Started": "bg-red-100 text-red-800",
  "In Progress": "bg-yellow-100 text-yellow-800",
  "Completed": "bg-green-100 text-green-800"
}
export default function AssignTasks() {
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [tasks, setTasks] = useState([]);
  const { getAssignedTasks, getManagerID } = useMemo(() => ManagerAPI(token), [token]);
  const { createTask } = useMemo(() => TaskAPI(token), [token]);
  //const [employeeIDs, setEmployeeIDs] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null)
  const [employeeInput, setEmployeeInput] = useState([]);


  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getAssignedTasks();
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };

    fetchTasks();
  }, [getAssignedTasks]);

  //console.log(tasks);

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    taskName: '',
    taskID: '',
    taskDescription: '',
    taskDeadline: '',
    status: 'Not Started',
    employeeIDs: [],
    managerID: '1', // Assuming the current manager's ID is 1
    creationDate: new Date().toISOString(),
  })

  const handleInputChange = (e) => {
    setNewTask({ ...newTask, [e.target.name]: e.target.value })
  }
  const handleAddEmployee = () => {
    console.log(employeeInput);
    if (employeeInput.trim() && !newTask.employeeIDs.includes(employeeInput.trim())) {
      setNewTask(prev => ({
        ...prev,
        employeeIDs: [...prev.employeeIDs, employeeInput.trim()]
      }))
      setEmployeeInput('')
    }
  };

  const handleRemoveEmployee = (employee) => {
    setNewTask(prev => ({
      ...prev,
      employeeIDs: prev.employeeIDs.filter(id => id !== employee)
    }))
  }

  const handleEmployeeSelect = (employeeId) => {
    setNewTask(prev => ({
      ...prev,
      employeeIDs: prev.employeeIDs.includes(employeeId)
        ? prev.employeeIDs.filter(id => id !== employeeId)
        : [...prev.employeeIDs, employeeId]
    }))
  }
  const convertEmployeeuserIDstoMongoIDs = async (userIDs) => {
    try {
      const promises = userIDs.map(async (userID) => {
        const response = await api.post('https://emp-flow-etm-u6a2.vercel.app/employee/get-employee-by-name', { userID }, { headers: { Authorization: `Bearer ${token}` } });
        return response.data._id;
      })
      const results = await Promise.all(promises);
      return results;
    }
    catch (err) {
      console.error("Error converting employee IDs to MongoDB IDs: ", err);
      return [];
    }
  }
  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleString('en-US', {
      weekday: 'long',
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the new task to your backend
    console.log('New task:', newTask)
    console.log('Employee IDs:', newTask.employeeIDs);
    const mongoIDs = await convertEmployeeuserIDstoMongoIDs(newTask.employeeIDs);
    console.log('Mongo IDs:', mongoIDs);
    const managerID = await getManagerID();
    console.log('Manager ID:', managerID);

    const task = {
      ...newTask,
      employeeIDs: mongoIDs,
      managerID: managerID,
    }
    console.log('Task to be created:', task);
    const res = await createTask(task);
    console.log("Response: ", res);

    setTasks([...tasks, { taskID: task.taskID, taskName: task.taskName, taskDeadline: task.taskDeadline }])
    setIsDialogOpen(false)
    setNewTask({
      taskName: '',
      taskID: '',
      taskDescription: '',
      taskDeadline: '',
      status: 'Not Started',
      employeeIDs: [],
      managerID: '1',
      creationDate: new Date().toISOString(),
    })
  }

  return (
    // <div className="container mx-auto p-8">
    //   <h1 className="text-2xl font-bold mb-4 mt-2">My Tasks</h1>

    //   <div className="bg-white shadow rounded-lg p-4 mb-4">
    //     <div className="flex justify-between items-center mb-4">
    //       <h2 className="text-xl font-bold text-indigo-700">Create Tasks</h2>
    //       <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
    //         <DialogTrigger asChild>
    //           <Button variant="outline" size="icon">
    //             <Plus className="h-4 w-4" />
    //           </Button>
    //         </DialogTrigger>
    //         <DialogContent>
    //         <DialogHeader>
    //             <DialogTitle>Create New Task</DialogTitle>
    //           </DialogHeader>
    //           <form onSubmit={handleSubmit} className="space-y-4">
    //             <Input
    //               name="taskName"
    //               placeholder="Task Name"
    //               value={newTask.taskName}
    //               onChange={handleInputChange}
    //               required
    //             />
    //             <Input
    //               name="taskID"
    //               placeholder="Task ID"
    //               value={newTask.taskID}
    //               onChange={handleInputChange}
    //               required
    //             />
    //             <Input
    //               name="taskDescription"
    //               placeholder="Task Description"
    //               value={newTask.taskDescription}
    //               onChange={handleInputChange}
    //               required
    //             />
    //             <Input
    //               name="taskDeadline"
    //               type="datetime-local"
    //               value={newTask.taskDeadline}
    //               onChange={handleInputChange}
    //               required
    //             />
    //             <Select
    //               name="status"
    //               value={newTask.status}
    //               onValueChange={(value) => setNewTask({ ...newTask, status: value })}
    //             >
    //               <SelectTrigger>
    //                 <SelectValue placeholder="Select status" />
    //               </SelectTrigger>
    //               <SelectContent>
    //                 <SelectItem value="Not Started">Not Started</SelectItem>
    //                 <SelectItem value="In Progress">In Progress</SelectItem>
    //                 <SelectItem value="Completed">Completed</SelectItem>
    //               </SelectContent>
    //             </Select>
    //             <div>
    //               <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Employees:</label>
    //               <div className="flex space-x-2 mb-2">
    //                 <Input
    //                   placeholder="Enter Employee ID"
    //                   value={employeeInput}
    //                   onChange={(e) => setEmployeeInput(e.target.value)}
    //                 />
    //                 <Button type="button" onClick={handleAddEmployee}>Add Employee</Button>
    //               </div>
    //               <div className="flex flex-wrap gap-2">
    //                 {(newTask.employeeIDs || []).map((employee, index) => (
    //                   <div key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
    //                     {employee}
    //                     <button
    //                       type="button"
    //                       onClick={() => handleRemoveEmployee(employee)}
    //                       className="ml-1 text-blue-600 hover:text-blue-800"
    //                     >
    //                       <X className="h-4 w-4" />
    //                     </button>
    //                   </div>
    //                 ))}
    //               </div>
    //             </div>
    //             <Button type="submit">Assign Task</Button>
    //           </form>
    //         </DialogContent>
    //       </Dialog>
    //     </div>
    //     {tasks.map((task, index) => (
    //       <div key={index} className="flex items-center justify-between py-2 border-b">
    //         <div className="flex items-center space-x-2">
    //           <Checkbox id={`task-${task.id}`} />
    //           <label htmlFor={`task-${task.id}`} className=" text-base font-medium">
    //             {task.taskName}
    //           </label>
    //         </div>
    //         <div className="flex items-center space-x-2">
    //           <span className="text-xs text-gray-500">{formatDate(task.taskDeadline)}</span>
    //           <Button variant="link" size="sm">
    //             View details
    //           </Button>
    //         </div>
    //       </div>
    //     ))}
    //   </div>
    // </div>
    <div className="container mx-auto p-8 mb-0 pb-2">
      <div className="bg-white shadow rounded-lg p-4 mb-4">
        <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold mt-1 ml-1 text-indigo-700">Create and Assign Tasks</h2>
          <Dialog>
            <DialogTrigger asChild>
              <Button className="bg-indigo-700">
                <Plus className="mr-2 h-4 w-4" /> Create Task
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[600px]">
              <DialogHeader>
                <DialogTitle className="text-indigo-700 mb-3 font-bold">Create New Task</DialogTitle>
              </DialogHeader>
              <form onSubmit={handleSubmit} className="space-y-4">
                 <Input
                  name="taskName"
                  placeholder="Task Name"
                  value={newTask.taskName}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="taskID"
                  placeholder="Task ID"
                  value={newTask.taskID}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="taskDescription"
                  placeholder="Task Description"
                  value={newTask.taskDescription}
                  onChange={handleInputChange}
                  required
                />
                <Input
                  name="taskDeadline"
                  type="datetime-local"
                  value={newTask.taskDeadline}
                  onChange={handleInputChange}
                  required
                />
                <Select
                  name="status"
                  value={newTask.status}
                  onValueChange={(value) => setNewTask({ ...newTask, status: value })}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="Not Started">Not Started</SelectItem>
                    <SelectItem value="In Progress">In Progress</SelectItem>
                    <SelectItem value="Completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Assign to Employees:</label>
                  <div className="flex space-x-2 mb-2">
                    <Input
                      placeholder="Enter Employee ID"
                      value={employeeInput}
                      onChange={(e) => setEmployeeInput(e.target.value)}
                    />
                    <Button type="button" onClick={handleAddEmployee} className="bg-indigo-700">Add Employee</Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {(newTask.employeeIDs || []).map((employee, index) => (
                      <div key={index} className="bg-blue-100 text-blue-800 text-sm font-medium px-2.5 py-0.5 rounded-full flex items-center">
                        {employee}
                        <button
                          type="button"
                          onClick={() => handleRemoveEmployee(employee)}
                          className="ml-1 text-blue-600 hover:text-blue-800"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>
                <Button type="submit" className="bg-indigo-700">Assign Task</Button>
              </form>
            </DialogContent>
          </Dialog>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              {/* <TableHead className="w-[50px]"></TableHead> */}
              <TableHead>Task Name</TableHead>
              <TableHead>Deadline</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Assigned To</TableHead>
              <TableHead className="text-right">View Details</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {tasks.map((task) => (
              <>
                <TableRow key={task.taskID}>
                  {/* <TableCell>
                    <Checkbox id={`task-${task.id}`} />
                  </TableCell> */}
                  <TableCell className="font-medium text-base">{task.taskName}</TableCell>
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
                      {task.employeeIDs.slice(0, 3).map((emp, index) => (
                        <Avatar key={index} className="border-2 border-background">
                          <AvatarFallback>{emp.slice(0, 2).toUpperCase()}</AvatarFallback>
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
                      onClick={() => setExpandedTask(expandedTask === task.taskID ? null : task.taskID)}
                    >
                      {expandedTask === task.id ? (
                        <ChevronUp className="h-4 w-4" />
                      ) : (
                        <ChevronDown className="h-4 w-4" />
                      )}
                      <span className="sr-only">View details</span>
                    </Button>
                  </TableCell>
                </TableRow>
                {expandedTask === task.taskID && (
                  <TableRow>
                    <TableCell colSpan={6}>
                      <div className="p-4 bg-muted rounded-md space-y-2">
                        <p><strong>Task ID:</strong> {task.taskID}</p>
                        <p><strong>Description:</strong> {task.taskDescription}</p>
                        <p><strong>Created:</strong> {formatDate(task.creationDate)}</p>
                        <p><strong>Manager ID:</strong> {task.managerID}</p>
                        <div>
                          <strong>Assigned to:</strong>
                          <div className="flex flex-wrap gap-2 mt-2">
                            {task.employeeIDs.map((emp, index) => (
                              <Badge key={index} variant="secondary">{emp}</Badge>
                            ))}
                          </div>
                        </div>
                      </div>
                    </TableCell>
                  </TableRow>
                )}
              </>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}