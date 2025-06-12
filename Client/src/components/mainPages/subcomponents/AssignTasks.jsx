import React, { useState } from 'react'
import { Plus, X, Users, User } from 'lucide-react'
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { ChevronDown, ChevronUp, Clock, AlertCircle } from 'lucide-react'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Card, CardContent } from "@/components/ui/card"
import ManagerAPI from '@/api/ManagerAPI'
import UserAPI from '@/api/UserAPI'
import TaskAPI from '@/api/TaskAPI'
import { useEffect } from 'react'
import { GlobalState } from '../../../GlobalState'
import { useContext, useMemo } from 'react'
import api from '../../../utils/axios'
import { useToast } from "../../../hooks/use-toast";
import { Toast, ToastProvider, ToastViewport } from "@/components/ui/toast";
import {Toaster} from "@/components/ui/toaster";
import { ToastAction } from "@/components/ui/toast";
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
  const [teams, setTeams] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [selectedTeam, setSelectedTeam] = useState(null);
  const [assignToEntireTeam, setAssignToEntireTeam] = useState(false);
  const { getAssignedTasks, getManagerID } = useMemo(() => ManagerAPI(token), [token]);
  const { createTask } = useMemo(() => TaskAPI(token), [token]);
  //const [employeeIDs, setEmployeeIDs] = useState([]);
  const [expandedTask, setExpandedTask] = useState(null)
  const [employeeInput, setEmployeeInput] = useState('');
  const [assignmentTab, setAssignmentTab] = useState("individual");

  const [showToast, setShowToast] = useState(false);
  const [toastMessage, setToastMessage] = useState({
    title: "",
    description: "",
    type: "default" // can be 'default', 'success', 'error'
  });

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getAssignedTasks();
        setTasks(tasks);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };
    const fetchTeams = async () => {
      const role = state.role[0];
      if (role == 'Team Manager') {
        try {
          const response = await api.get('/team/manager-teams', {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTeams(response.data);
        } catch (error) {
          console.error("Error fetching teams:", error);
        }
      }
    };
    fetchTasks();
    fetchTeams();
  }, [getAssignedTasks, token, state.role]);

  useEffect(() => {
    const fetchTeamMembers = async () => {
      if (selectedTeam) {
        try {
          console.log(`Fetching members for team: ${selectedTeam}`);
          const response = await api.get(`/team/${selectedTeam}/members`, {
            headers: { Authorization: `Bearer ${token}` }
          });
          setTeamMembers(response.data);
        } catch (error) {
          console.error("Error fetching team members:", error);
          // Reset team members if there's an error
          setTeamMembers([]);
        }
      } else {
        // Clear team members when no team is selected
        setTeamMembers([]);
      }
    };

    fetchTeamMembers();
  }, [selectedTeam, token]); // This will run whenever selectedTeam changes
  //console.log(tasks);

  const [isDialogOpen, setIsDialogOpen] = useState(false)
  const [newTask, setNewTask] = useState({
    taskName: '',
    taskID: '',
    taskDescription: '',
    taskDeadline: '',
    status: 'Not Started',
    employeeIDs: [],
    managerID: '',
    teamID: '',
    creationDate: new Date().toISOString(),
    assignToEntireTeam: false,
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

  const handleTeamSelect = async (teamId) => {
    setSelectedTeam(teamId);
    setNewTask(prev => ({ ...prev, teamID: teamId }));
    // try {
    //   // Fetch team members when a team is selected
    //   const response = await api.get(`/team/${teamId}/members`, {
    //     headers: { Authorization: `Bearer ${token}` }
    //   });
    //   setTeamMembers(response.data);
    // } catch (error) {
    //   console.error("Error fetching team members:", error);
    // }
  }

  const handleAssignmentTypeChange = (value) => {
    setAssignmentTab(value);
    setNewTask(prev => ({
      ...prev,
      assignEntireTeam: value === "team",
      employeeIDs: [] // Clear employee IDs when switching tabs
    }));
  };

  const handleTeamMemberSelect = (userId) => {
    if (newTask.employeeIDs.includes(userId)) {
      handleRemoveEmployee(userId);
    } else {
      setNewTask(prev => ({
        ...prev,
        employeeIDs: [...prev.employeeIDs, userId]
      }));
    }
  };

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
        const response = await api.post('/employee/get-employee-by-name', { userID }, { headers: { Authorization: `Bearer ${token}` } });
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
  const { toast } = useToast(); 

  const handleSubmit = async (e) => {
    e.preventDefault();
    // Here you would typically send the new task to your backend
    console.log('New task:', newTask)
    console.log('Employee IDs:', newTask.employeeIDs);
    const mongoIDs = await convertEmployeeuserIDstoMongoIDs(newTask.employeeIDs);
    console.log('Mongo IDs:', mongoIDs);
    try {
      const managerID = await getManagerID();
      console.log('Manager ID:', managerID);

      let payload = {
        ...newTask,
        managerID,
      };
      const teamName = selectedTeam ? teams.find(team => team._id === selectedTeam)?.teamName || "Selected team" : "";

      // const task = {
      //   ...newTask,
      //   employeeIDs: mongoIDs,
      //   managerID: managerID,
      // }
      // console.log('Task to be created:', task);
      // const res = await createTask(task);
      // console.log("Response: ", res);

      // setTasks([...tasks, { taskID: task.taskID, taskName: task.taskName, taskDeadline: task.taskDeadline }])
      // setIsDialogOpen(false)
      console.log("Task payload:", payload);

      let response;
      if (assignmentTab === "team") {
        // Call the createAndAssignTask endpoint for team assignment
        response = await api.post(`/tasks/create-and-assign-to-team/${selectedTeam}`, {
          ...payload,
          assignEntireTeam: true
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Show success toast for team assignment
        toast({
          title: "✅ Task created successfully",
          description: (
            <div className="flex flex-col gap-1">
              <p><span className="font-semibold">{newTask.taskName}</span> has been assigned to team: <span className="font-semibold">{teamName}</span></p>
              <p className="text-sm text-muted-foreground">{teamMembers.length} team members will receive this task</p>
            </div>
          ),
        });
      } else {
        // Use the regular createTask for individual assignment
        const mongoIDs = await convertEmployeeuserIDstoMongoIDs(newTask.employeeIDs);
        payload.employeeIDs = mongoIDs;
        response = await api.post(`/tasks/create-and-assign-to-team/${selectedTeam}`, {
          ...payload,
          assignEntireTeam: false
        }, {
          headers: { Authorization: `Bearer ${token}` }
        });
        // Show success toast for non-team employees
        toast({
          title: "✅ Task created successfully",
          description: (
            <div className="flex flex-col gap-1">
              <p><span className="font-semibold">{newTask.taskName}</span> has been assigned to <span className="font-semibold">{newTask.employeeIDs.length} employee(s)</span></p>
              <p className="text-xs text-muted-foreground mt-1">Task ID: {newTask.taskID}</p>
            </div>
          ),
        });
      }

      console.log("Task created response:", response);

      // Refresh the task list
      // const updatedTasks = await getAssignedTasks();
      // setTasks(updatedTasks);

      setNewTask({
        taskName: '',
        taskID: '',
        taskDescription: '',
        taskDeadline: '',
        status: 'Not Started',
        employeeIDs: [],
        managerID: '',
        teamID: '',
        creationDate: new Date().toISOString(),
        assignEntireTeam: false
      });
      setSelectedTeam(null);
      setTeamMembers([]);
      setAssignmentTab("individual");

      // Now refresh tasks after state has been reset
      const updatedTasks = await getAssignedTasks();
      setTasks(updatedTasks);
    } catch (error) {
      console.error("Error creating task:", error);
      // Show error toast
      toast({
        variant: "destructive",
        title: "❌ Failed to create task",
        description: error.response?.data?.msg || "An unexpected error occurred",
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    }
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
    <>
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
                  {/* Team Selection */}
                  <div className="space-y-2">
                    <Label htmlFor="teamSelect">Team</Label>
                    <Select
                      value={selectedTeam}
                      onValueChange={handleTeamSelect}
                    >
                      <SelectTrigger id="teamSelect">
                        <SelectValue placeholder="Select a team" />
                      </SelectTrigger>
                      <SelectContent>
                        {teams.map(team => (
                          <SelectItem key={team._id} value={team._id}>
                            {team.teamName}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  {selectedTeam && (
                    <div className="space-y-2">
                      <Tabs defaultValue="individual" value={assignmentTab} onValueChange={handleAssignmentTypeChange}>
                        <TabsList className="grid w-full grid-cols-2">
                          <TabsTrigger value="individual" className="flex items-center">
                            <User className="mr-2 h-4 w-4" />
                            Individual Members
                          </TabsTrigger>
                          <TabsTrigger value="team" className="flex items-center">
                            <Users className="mr-2 h-4 w-4" />
                            Entire Team
                          </TabsTrigger>
                        </TabsList>
                        <TabsContent value="individual" className="mt-4">
                          <Card>
                            <CardContent className="pt-4">
                              <div className="space-y-2">
                                <Label htmlFor="teamMembers">Select Team Members</Label>
                                <div className="grid grid-cols-1 gap-2 max-h-40 overflow-y-auto">
                                  {teamMembers.map(member => (
                                    <div
                                      key={member._id}
                                      className={`flex items-center justify-between p-2 rounded border ${newTask.employeeIDs.includes(member.userID)
                                        ? 'bg-indigo-50 border-indigo-300'
                                        : 'bg-white'
                                        }`}
                                      onClick={() => handleTeamMemberSelect(member.userID)}
                                    >
                                      <div className="flex items-center">
                                        <Avatar className="h-6 w-6 mr-2">
                                          <AvatarFallback>{member.userID.slice(0, 2).toUpperCase()}</AvatarFallback>
                                        </Avatar>
                                        <span>{member.userID}</span>
                                      </div>
                                      <Badge variant={newTask.employeeIDs.includes(member.userID) ? "default" : "outline"}>
                                        {newTask.employeeIDs.includes(member.userID) ? "Selected" : "Select"}
                                      </Badge>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                        <TabsContent value="team" className="mt-4">
                          <Card>
                            <CardContent className="pt-4 pb-2">
                              <div className="flex justify-between items-center">
                                <div>
                                  <p className="text-sm text-gray-500">This task will be assigned to all members of the selected team</p>
                                  <p className="font-medium mt-1">Total members: {teamMembers.length}</p>
                                </div>
                                <Badge className="bg-indigo-700">Entire Team</Badge>
                              </div>
                            </CardContent>
                          </Card>
                        </TabsContent>
                      </Tabs>
                    </div>
                  )}
                  {/* Manual employee input when no team is selected */}
                  {!selectedTeam && (
                    <div>
                      <Label className="block text-sm font-medium text-gray-700 mb-2">Assign to Employees:</Label>
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
                  )}
                  <Button type="submit" className="bg-indigo-700 w-full">
                    Create and Assign Task
                  </Button>
                </form>
              </DialogContent>
            </Dialog>
          </div>
          {/* <div>
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
        </div> */}
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
                <React.Fragment key={task._id || task.taskID}>
                  <TableRow>
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
                      <div className="flex items-center">
                        {task.teamID && (
                          <Badge variant="outline" className="mr-2 flex items-center">
                            <Users className="h-3 w-3 mr-1" />
                            {task.teamID.teamName || "Team"}
                          </Badge>
                        )}
                        <div className="flex -space-x-2">
                          {task.employeeIDs.slice(0, 3).map((emp, index) => {
                            // Handle different formats of employee data
                            const empInitials = typeof emp === 'string'
                              ? emp.slice(0, 2).toUpperCase()
                              : (emp.userID
                                ? emp.userID.slice(0, 2).toUpperCase()
                                : (emp._id
                                  ? emp._id.toString().slice(0, 2).toUpperCase()
                                  : "??"));
                            return (
                              <Avatar key={index} className="border-2 border-background">
                                <AvatarFallback>{empInitials}</AvatarFallback>
                              </Avatar>
                            );
                          })}
                          {task.employeeIDs.length > 3 && (
                            <Avatar className="border-2 border-background">
                              <AvatarFallback>+{task.employeeIDs.length - 3}</AvatarFallback>
                            </Avatar>
                          )}
                        </div>
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
                        <span className="sr-only">View details</span>
                      </Button>
                    </TableCell>
                  </TableRow>
                  {expandedTask === task._id && (
                    <TableRow>
                      <TableCell colSpan={6}>
                        <div className="p-4 bg-muted rounded-md space-y-2">
                          <p><strong>Task ID:</strong> {task.taskID}</p>
                          <p><strong>Description:</strong> {task.taskDescription}</p>
                          <p><strong>Created:</strong> {formatDate(task.creationDate)}</p>
                          {task.teamID && (
                            <p><strong>Team:</strong> {task.teamID.teamName || "Unknown Team"}</p>
                          )}
                          <div>
                            <strong>Assigned to:</strong>
                            <div className="flex flex-wrap gap-2 mt-2">
                              {task.employeeIDs.map((emp, index) => {
                                const empName = typeof emp === 'string'
                                  ? emp
                                  : emp.userID || (emp._id ? emp._id.toString() : "Unknown");

                                return (
                                  <Badge key={index} variant="secondary">{empName}</Badge>
                                );
                              })}
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
        </div>
      </div>
      <Toaster />
    </>
  )
}