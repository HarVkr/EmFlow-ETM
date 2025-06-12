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

  console.log(employeeData);

  const getEmployeeTasks = useCallback((employeeId) => {
    return assignedTasks.filter(task => task.employeeIDs.includes(employeeId));
  }, [assignedTasks]);

  const makeEmailfromName = (name) => {
    return name.split(' ').join('').toLowerCase() + '@gmail.com';
  }

  const totalPages = Math.ceil(employeeData.length / itemsPerPage);
  const paginatedEmployees = useMemo(() =>
    employeeData.slice((page - 1) * itemsPerPage, page * itemsPerPage),
    [employeeData, page, itemsPerPage]
  );
  console.log(paginatedEmployees);

  if (isLoading) {
    return (
      <div className="w-full p-8 gap-10 animate-pulse">
        {/* Dashboard header skeleton */}
        <div className="h-8 w-48 bg-gray-200 rounded-md mb-6"></div>
        
        {/* Assigned Tasks table skeleton */}
        <div className="bg-white rounded-lg shadow mb-10">
          <div className="p-4 border-b">
            <div className="h-7 w-40 bg-gray-200 rounded-md"></div>
          </div>
          
          <div className="p-4">
            {/* Table header skeleton */}
            <div className="flex border-b py-3">
              <div className="w-1/3 h-4 bg-gray-200 rounded-md"></div>
              <div className="w-1/6 h-4 bg-gray-200 rounded-md mx-2"></div>
              <div className="w-1/6 h-4 bg-gray-200 rounded-md ml-auto"></div>
              <div className="w-1/6 h-4 bg-gray-200 rounded-md ml-2"></div>
            </div>
            
            {/* Table rows skeleton */}
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-center py-4 border-b">
                <div className="flex items-center">
                  <div className="h-10 w-10 rounded-full bg-gray-200 mr-3"></div>
                  <div>
                    <div className="h-4 w-24 bg-gray-200 rounded-md"></div>
                    <div className="h-3 w-32 bg-gray-200 rounded-md mt-2"></div>
                  </div>
                </div>
                <div className="h-4 w-16 bg-gray-200 rounded-md mx-6"></div>
                <div className="h-4 w-8 bg-gray-200 rounded-md ml-auto mr-4"></div>
                <div className="h-6 w-16 bg-gray-200 rounded-full mr-2"></div>
                <div className="h-8 w-8 rounded-md bg-gray-200"></div>
              </div>
            ))}
          </div>
          
          {/* Pagination skeleton */}
          <div className="flex items-center justify-between px-4 py-4 border-t">
            <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
            <div className="flex items-center space-x-2">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="h-8 w-10 bg-gray-200 rounded-md"></div>
              ))}
            </div>
            <div className="h-8 w-24 bg-gray-200 rounded-md"></div>
          </div>
        </div>
        
        {/* Charts area skeleton */}
        <div className="flex flex-row justify-between w-full gap-10">
          <div className="w-1/2 h-80 bg-gray-200 rounded-lg"></div>
          <div className="w-1/2 h-80 bg-gray-200 rounded-lg"></div>
        </div>
      </div>
    );
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
              return (
                <TableRow key={employee._id}>
                  <TableCell className="font-medium">
                    <div className="flex items-center">
                      <div>
                        <div>{employee.userID}</div>
                        <div className="text-sm text-gray-500">{makeEmailfromName(employee.userID)}</div>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell>
                    <div>{employee.role}</div>
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
      <div className='flex flex-row justify-between gap-10'>
        <MyAttendance />
        <MonthlyTaskPerformance />
      </div>
    </div>
  )
}