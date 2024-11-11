import React, { useState, useContext } from 'react'
import { GlobalState } from '../../GlobalState'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { ChevronLeft, ChevronRight, ChevronDown } from 'lucide-react'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import ManagerAPI from '@/api/ManagerAPI'
import UserAPI from '@/api/UserAPI'
import { useEffect, useCallback, useMemo } from 'react'
import MyAttendance from './AttendanceRecord'
import MonthlyTaskPerformance from './MonthlyTaskPerformance'

const TaskStatusBadge = ({ status }) => {
  const colorMap = {
    'Not Started': 'bg-gray-200 text-gray-800',
    'In Progress': 'bg-blue-200 text-blue-800',
    'Completed': 'bg-green-200 text-green-800',
  }

  return (
    <span className={`px-2 py-1 rounded-full text-xs font-semibold ${colorMap[status]}`}>
      {status}
    </span>
  )
}

export default function ManDashboard() {
  // Helper Code: 
  const state = useContext(GlobalState);
  const [token] = state.token;
  const [assignedTasks, setAssignedTasks] = useState([]);
  const [employeeData, setEmployeeData] = useState([]);
  const [allemployeeIDs, setAllEmployeeIDs] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [page, setPage] = useState(1);
  const itemsPerPage = 5;

  const { getAssignedTasks } = useMemo(() => ManagerAPI(token), [token]);
  const { getEmployeeDatabyIDs } = useMemo(() => UserAPI(token), [token]);

  console.log("Reached here");
  
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const tasks = await getAssignedTasks();
        setAssignedTasks(tasks);
        const employeeIDs = [...new Set(tasks.flatMap(task => task.employeeIDs))];
        setAllEmployeeIDs(employeeIDs);
      } catch (error) {
        console.error("Error fetching assigned tasks:", error);
      }
    };

    fetchTasks();
  }, [getAssignedTasks]);

  // Fetch employee data
  useEffect(() => {
    const fetchEmployeeData = async () => {
      if (allemployeeIDs.length > 0) {
        setIsLoading(true);
        try {
          console.log("Fetching employee data for IDs:", allemployeeIDs);
          const employees = await getEmployeeDatabyIDs(allemployeeIDs);
          setEmployeeData(employees);
        } catch (error) {
          console.error("Error fetching employee data:", error);
        }
        setIsLoading(false);
      }
    };
    fetchEmployeeData();
  }, [allemployeeIDs, getEmployeeDatabyIDs]);

  // const getEmployeeTasks = (employeeId) => {
  //   return assignedTasks.filter(task => task.employeeID === employeeId);
  // }

  console.log(employeeData);

  const getEmployeeTasks = useCallback((employeeId) => {
    return assignedTasks.filter(task => task.employeeIDs.includes(employeeId));
  }, [assignedTasks]);

  const makeEmailfromName = (name) => {
    return name.split(' ').join('').toLowerCase() + '@gmail.com';
  }

  // My Code:
  //const totalPages = Math.ceil(employeeData.length / itemsPerPage);
  // const paginatedEmployees = employeeData.slice(
  //   (page - 1) * itemsPerPage,
  //   page * itemsPerPage
  // );

  // Helper: 
  const totalPages = Math.ceil(employeeData.length / itemsPerPage);
  const paginatedEmployees = useMemo(() =>
    employeeData.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [employeeData, page, itemsPerPage]
  );
  console.log(paginatedEmployees);
  if (isLoading) {
    return <div>Loading...</div>;
  }


  // My Code: 
  //   const state = useContext(GlobalState);
  //   const [token] = state.token;
  //   const [employeeTasks, setEmployeeTasks] = useState([]);
  //   //console.log(token);
  //   const { assignedTasks: [assignedTasks] } = ManagerAPI(token);

  //   console.log("Assigned Tasks: ", assignedTasks);

  //   const [employeeIDs, setEmployeeIDs] = useState([]);
  //   const { getEmployeeDatabyIDs } = UserAPI(token);
  //   const [employeeData, setEmployeeData] = useState([]);


  // const [page, setPage] = useState(1)
  // const itemsPerPage = 5
  //const totalPages = Math.ceil(assignedTaskstasks.length / itemsPerPage)

  //   const paginatedEmployees = dummyEmployees.slice(
  //     (page - 1) * itemsPerPage,
  //     page * itemsPerPage
  //   )

  //   // const getEmployeeIDS = () => {
  //   //   const ids = [];
  //   //   for (let i = 0; i < assignedTasks.length; i++) {
  //   //     if (!ids.includes(assignedTasks[i].employeeID)) {
  //   //       ids.push(assignedTasks[i].employeeID);
  //   //     }
  //   //   }
  //   //   setEmployeeIDs(ids);
  //   // }
  //   // getEmployeeIDS();

  // //   useEffect(() => {
  // //     let isMounted = true; // Flag to check if the component is mounted

  // //     const fetchEmployeeData = async () => {
  // //         const ids = employeeIDs; // Replace with actual IDs
  // //         const data = await getEmployeeDatabyIDs(ids);
  // //         if (isMounted && data) { // Check if the component is still mounted before updating the state
  // //             setEmployeeData(data);
  // //             setIsLoading(false);
  // //         }
  // //     };

  // //     fetchEmployeeData();

  // //     return () => {
  // //         isMounted = false; // Cleanup function to set the flag to false when the component unmounts
  // //     };
  // // }, [getEmployeeDatabyIDs]);



  // //   const getEmployeeTasks = (employeeId) => {
  // //     return tasks.filter(task => task.employeeID === employeeId)
  // //   }

  // //   // const getEmployeeDatabyIDs = async (ids) => {
  // //   //   const userAPI = UserAPI(token);
  // //   //   const employeeData = await userAPI.getEmployeeDatabyIDs(ids);
  // //   //   console.log(employeeData);
  // //   // }
  // //   getEmployeeDatabyIDs(employeeIDs);

  if (assignedTasks.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div className="w-full p-8 gap-10">
      <h2 className="text-2xl font-bold mb-4 mt-3">Dashboard</h2>
      <div className="bg-white rounded-lg shadow mb-10">
        <div className="p-4 border-b">
          <h3 className="text-xl font-bold text-indigo-700">Assigned Tasks</h3>
        </div>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[300px]">Name</TableHead>
              <TableHead>Role</TableHead>
              <TableHead className="text-right">No. of Tasks Assigned</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {paginatedEmployees.map((employee) => {
              {/* console.log(employee);
              console.log(employee.tasks);
              console.log(employee.tasks.length);
              console.log(employee._id);
              console.log(employee.role); */}
              //const employeeTasks = getEmployeeTasks(employee._id);
              return (
                <TableRow key={employee._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      {/* <Avatar className="h-10 w-10 mr-3">
                        <AvatarImage src={employee.avatar} alt={employee.name} />
                        <AvatarFallback>{employee.name.charAt(0)}</AvatarFallback>
                      </Avatar> */}
                      <div>
                        <div>{employee.userID}</div>
                        <div className="text-sm text-gray-500">{makeEmailfromName(employee.userID)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{employee.role}</div>
                    {/* <div className="text-sm text-gray-500">{employee.subRole}</div> */}
                  </TableCell>
                  <TableCell className="text-right">{employee.tasks.length}</TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end space-x-2">
                      <Badge variant={employee.status === 'Active' ? 'success' : 'destructive'}>
                        {employee.status}
                      </Badge>
                      {employee.tasks.length > 0 && (
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button variant="outline" size="sm">
                              <ChevronDown className="h-4 w-4" />
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-80">
                            <div className="space-y-2">
                              <h4 className="font-semibold">Tasks Status</h4>
                              {employee.tasks.map((task) => (
                                <div key={task._id} className="flex justify-between items-center">
                                  <span className="text-sm">{task.taskName}</span>
                                  <TaskStatusBadge status={task.status} />
                                </div>
                              ))}
                            </div>
                          </PopoverContent>
                        </Popover>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
        <div className="flex items-center justify-between px-4 py-4 border-t">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.max(1, p - 1))}
            disabled={page === 1}
          >
            <ChevronLeft className="h-4 w-4 mr-2" />
            Previous
          </Button>
          <div className="flex items-center space-x-2">
            {[...Array(totalPages)].map((_, i) => (
              <Button
                key={i}
                variant={page === i + 1 ? "default" : "outline"}
                size="sm"
                className="w-10"
                onClick={() => setPage(i + 1)}
              >
                {i + 1}
              </Button>
            ))}
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPage(p => Math.min(totalPages, p + 1))}
            disabled={page === totalPages}
          >
            Next
            <ChevronRight className="h-4 w-4 ml-2" />
          </Button>
        </div>
      </div>
      <div className='flex flex-row justify-between w-full gap-10'>
        <MyAttendance />
        <MonthlyTaskPerformance />
      </div>
    </div>
  )
}