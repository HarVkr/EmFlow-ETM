import React, { useState, useEffect } from 'react'
import api from '../utils/axios';
import UserAPI from './UserAPI';
const ManagerAPI = (token) => {
    // Helper Code:
    const getAssignedTasks = async () => {
        try {
            const res = await api.get('/tasks/get-assigned-tasks', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error fetching assigned tasks: ", err.response ? err.response.data.msg : err.message);
            return [];
        }
    };
    const getManagerID = async () => {
        const { getUserData } = UserAPI(token);
        const userData = await getUserData();
        return userData ? userData._id : null;
    }
    const getManagerTeams = async () => {
        try {
            const res = await api.get('/team/manager-teams', {
                headers: { Authorization: `Bearer ${token}` }
            });
            return res.data;
        } catch (err) {
            console.error("Error fetching manager teams: ", err.response ? err.response.data.msg : err.message);
            return [];
        }
    };
    return { getAssignedTasks, getManagerID, getManagerTeams };

    // MY CODE:
    // const [assignedTasks, setAssignedTasks] = useState([]);

    // useEffect(() => {
    //     if(token){
    //         const fetchAssignedTasks = async () => {
    //             try{
    //                 const res = await axios.get('/tasks/get-assigned-tasks', {headers: {Authorization: `Bearer ${token}`}});
    //                 //console.log("Assigned Tasks: ", res.data);
    //                 setAssignedTasks(res.data);
    //             }
    //             catch(err){
    //                 console.error("Error fetching assigned tasks: ", err.response ? err.response.data.msg : err.message);
    //             }
    //         };
    //         fetchAssignedTasks();
    //     }
    // }, [token]);

    // return {
    //     //assignedTasks: [assignedTasks, setAssignedTasks]

    // };
}

export default ManagerAPI;