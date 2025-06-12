import { createContext } from "react";
import { useState, useEffect } from "react";
import api from "../src/utils/axios";
import UserAPI from "./api/UserAPI";
import TaskAPI from "./api/TaskAPI";
import EventAPI from "./api/EventAPI";
import Cookies from "js-cookie";
import { useMemo } from "react";

export const GlobalState = createContext();

// const fetchData = async (token) => {
//     const userAPI = UserAPI(token);
//     const userData = await userAPI.getUserData();
//         if (userData) {
//             setIsLogged(true);
//             setTasks(userData.tasks);
//             setEvents(userData.events);
//             // setIsAdmin(userData.role === 1);
//         }
// }
export const DataProvider = ({ children }) => {
    const [token, setToken] = useState(false);
    const [isLogged, setIsLogged] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);
    const [tasks, setTasks] = useState([]);
    const [events, setEvents] = useState([]);
    const [role, setRole] = useState("");
    const [teamID, setTeamID] = useState(null);
    const [userID, setUserID] = useState(null);

    const refreshToken = async () => {
        try{
            console.log("Refreshing the Token...");

            const res = await api.get('/employee/refresh_token', {
                withCredentials: true
            });
            console.log("Request Sent");

            // const refreshTokennew = Cookies.get('refreshtoken');
            // if (!refreshTokennew) {
            //     console.log("No refresh token found in cookies");
            //     return;
            // }

            // const res = await axios.post('/employee/refresh_token', {
            //     token: refreshTokennew
            // }, {
            //     withCredentials: true
            // });
            console.log("Request Sent");

            console.log("Response Data: ", res.data);
            if(res.data.accessToken){
                setToken(res.data.accessToken);
                console.log("Token Set: ", res.data.accessToken);
            } else{
                console.log("Access Token not found in response");
            }
        } catch(err){
            console.log("Error refreshing Token: ", err.response ? err.response.data.msg : err.message)
            if (err.response && err.response.status === 401) {
                // Token is expired or invalid
                localStorage.removeItem('firstLogin');
                //window.location.href = '/login';  // Redirect to login page
                setToken(false);
                setIsLogged(false);
            }
        }
    }
    useEffect(() => {
        const firstLogin = localStorage.getItem('firstLogin');
        if(firstLogin){
            refreshToken();
        }
    }, []);

    useEffect(() => {
        console.log("Token in GlobalState: ", token);
        if(token){
            const fetchData = async () => {
                const userAPI = UserAPI(token);
                const userData = await userAPI.getUserData();
                if (userData) {
                    setIsLogged(true);
                    setTasks(userData.tasks);
                    setRole(userData.role);
                    setEvents(userData.events);
                    setTeamID(userData.teamID);
                    setUserID(userData._id);
                    // setIsAdmin(userData.role === 1);
                }
            };
            fetchData();
        }
        // else{
        //     setIsLogged(false);
        //     setTasks([]);
        //     setEvents([]);
        // }
    }, [token]);

    console.log("I am here");
    
    const state = {
        token: [token, setToken],
        // UserAPI : userAPI,
        // TaskAPI : taskAPI,
        // EventAPI : eventAPI
        isLogged: [isLogged, setIsLogged],
        isAdmin: [isAdmin, setIsAdmin],
        role: [role, setRole],
        tasks: [tasks, setTasks],
        events: [events, setEvents],
        teamID: [teamID, setTeamID],
        userID: [userID, setUserID]
    }; 

    return (
        <GlobalState.Provider value={state}>
            {children}
        </GlobalState.Provider>
    )
}
export default GlobalState;
