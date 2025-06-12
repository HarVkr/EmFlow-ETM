// import axios from 'axios';
// import React, { useEffect, useState } from 'react'

// const UserAPI = (token) => {
//     const [isLogged, setisLogged] = useState(false);
//     const [isAdmin, setisAdmin] = useState(false);
//     const [tasks, setTasks] = useState([]);
//     const [events, setEvents] = useState([]);

//     useEffect(() => {
//         if (token) {
//             console.log("Token in UserAPI: ", token);
//             const getUser = async () => {
//                 try{
//                     console.log("Getting User Data...");
//                     const res = await axios.get('/employee/get-user', {
//                         headers: { Authorization: `Bearer ${token}`}
//                     });
//                     // setisLogged(true);
//                     // //res.data.role === 1 ? setisAdmin(true) : setisAdmin(false);
//                     // console.log("Employee Data: ", res.data);

//                     // setTasks(res.data.tasks);
//                     // setEvents(res.data.events);
//                     return res.data;
//                 }catch(err){
//                     console.log("Error: ", err.response ? err.response.data.msg : err.message);
//                     //alert(err.response.data.msg);
//                     return null;
//                 }
//             };
//             getUser();
//         } 
//     }, [token]);

//     return {
//         isLogged: [isLogged, setisLogged],
//         isAdmin: [isAdmin, setisAdmin],
//         tasks: [tasks, setTasks],
//         events: [events, setEvents]
//     };
// };

// export default UserAPI;

import api from '../utils/axios';
import React, { useEffect, useState } from 'react'
const UserAPI = (token) => {
    //const [employeeData, setEmployeeData] = useState([]);
    const getUserData = async () => {
        try {
            console.log("Getting User Data...");
            const res = await api.get('/employee/get-user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error getting user data: ", err);
            return null;
        }
    };
    const getEmployeeDatabyIDs = async (employeeIDs) => {
        // for (let i = 0; i < ids.length; i++) {
        //     try {
        //         console.log("Getting Employee Data...");
        //         const res = await axios.get(`/employee/get-employee/${ids[i]}`, {
        //             headers: { Authorization: `Bearer ${token}` }
        //         });
        //         setEmployeeData([...employeeData, res.data]);

        //     } catch (err) {
        //         console.error("Error getting employee data: ", err);
        //         return null;
        //     }
        // }
        // try {
        //     console.log("Getting Employee Data...");
        //     const promises = ids.map(id => 
        //         api.get(`/employee/get-employee/${id}`, {
        //             headers: { Authorization: `Bearer ${token}` }
        //         })
        //     );
        //     console.log("Preparing results..");

        //     const results = await Promise.all(promises);
        //     // Helper Code:
        //     return results.map(res => res.data);


        //     // My Code:
        //     // const employeeData = results.map(res => res.data);
        //     // //setEmployeeData(employeeData);
        //     // return employeeData;
        // } catch (err) {
        //     console.error("Error getting employee data: ", err);
        //     return null;
        // }
        try {
            // Normalize IDs to strings
            const validIDs = employeeIDs.map(id => {
                if (id && typeof id === 'object' && id._id) {
                    return id._id.toString();
                } else if (id && typeof id === 'object' && id.id) {
                    return id.id.toString();
                }
                return id.toString();
            });
            // Get the token directly from localStorage
            const token = localStorage.getItem('accessToken');
            if (!token) {
                throw new Error('No authentication token found');
            }
            console.log("Using token for API calls:", token.substring(0, 15) + "...");
        
            // Debug the request being made
            console.log("Making GET requests to:", validIDs.map(id => `/employee/get-employee/${id}`));

            // Make the requests with explicit headers
            const responses = await Promise.all(
                validIDs.map(async (id) => {
                    return await api.get(`/employee/get-employee/${id}`, {
                        headers: {
                            'Authorization': `Bearer ${token}`
                        }
                    });
                })
            );
            return responses.map(res => res.data);
        } catch (error) {
            console.error("Error getting employee data: ", error);
            throw error;
        }
    };
    const getEmployeeNamebyID = async (id) => {
        try {
            console.log("Getting Employee Name...");
            const res = await api.post(`/employee/get-employee-userid/`, id, {
                headers: { Authorization: `Bearer ${token}` }
            });
            res.data.userID;
        }
        catch (err) {
            console.error("Error getting employee name by ID: ", err);
            return null;
        }
    }
    const getTeamTasks = async (teamID) => {
        try {
            console.log("Getting Team Tasks...");
            const res = await api.get(`/team/${teamID}/get-tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;

        }
        catch (err) {
            console.error("Error getting team tasks: ", err.response ? err.response.data.msg : err.message);
            return null;
        }
    }
    const logoutUser = async () => {
        try {
            console.log("Logging Out...");
            const res = await api.post('/employee/logout', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
        catch (err) {
            console.error("Error logging out: ", err);
            return null;
        }
    }
    return { getUserData, getEmployeeDatabyIDs, getEmployeeNamebyID, getTeamTasks, logoutUser };
};

export default UserAPI;

