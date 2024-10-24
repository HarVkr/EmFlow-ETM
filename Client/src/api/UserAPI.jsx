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
//                     const res = await axios.get('http://localhost:5000/employee/get-user', {
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
            const res = await api.get('http://localhost:5000/employee/get-user', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error getting user data: ", err);
            return null;
        }
    };
    const getEmployeeDatabyIDs = async (ids) => {
                            // for (let i = 0; i < ids.length; i++) {
                            //     try {
                            //         console.log("Getting Employee Data...");
                            //         const res = await axios.get(`http://localhost:5000/employee/get-employee/${ids[i]}`, {
                            //             headers: { Authorization: `Bearer ${token}` }
                            //         });
                            //         setEmployeeData([...employeeData, res.data]);
                                    
                            //     } catch (err) {
                            //         console.error("Error getting employee data: ", err);
                            //         return null;
                            //     }
                            // }
        try {
            console.log("Getting Employee Data...");
            const promises = ids.map(id => 
                api.get(`http://localhost:5000/employee/get-employee/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                })
            );
            console.log("Preparing results..");
            
            const results = await Promise.all(promises);
            // Helper Code:
            return results.map(res => res.data);


            // My Code:
            // const employeeData = results.map(res => res.data);
            // //setEmployeeData(employeeData);
            // return employeeData;
        } catch (err) {
            console.error("Error getting employee data: ", err);
            return null;
        }
    };
    const getEmployeeNamebyID = async (id) => {
        try{
            console.log("Getting Employee Name...");
            const res = await api.post(`http://localhost:5000/employee/get-employee-userid/`, id ,{
                headers: { Authorization: `Bearer ${token}` }
            });
            res.data.userID;
        }
        catch(err){
            console.error("Error getting employee name by ID: ", err);
            return null;
        }
    }
    const getTeamTasks = async (teamID) => {
        try{
            console.log("Getting Team Tasks...");
            const res = await api.get(`http://localhost:5000/team/${teamID}/get-tasks`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
            
        }
        catch(err){
            console.error("Error getting team tasks: ", err.response ? err.response.data.msg : err.message);
            return null;
        }
    }
    const logoutUser = async () => {
        try{
            console.log("Logging Out...");
            const res = await api.post('http://localhost:5000/employee/logout', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        }
        catch(err){
            console.error("Error logging out: ", err);
            return null;
        }
    }
    return { getUserData, getEmployeeDatabyIDs, getEmployeeNamebyID, getTeamTasks, logoutUser};
};

export default UserAPI;

