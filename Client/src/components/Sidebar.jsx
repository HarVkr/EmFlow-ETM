// import {
//   Card,
//   Typography,
//   List,
//   ListItem,
//   ListItemPrefix,
//   ListItemSuffix,
//   Chip,
// } from "@material-tailwind/react";
// import {
//   PresentationChartBarIcon,
//   ShoppingBagIcon,
//   UserCircleIcon,
//   Cog6ToothIcon,
//   InboxIcon,
//   PowerIcon,
// } from "@heroicons/react/24/solid";
// import { useState, useEffect, useContext, useMemo } from "react";
// import { Link, Navigate, useLocation } from "react-router-dom";
// import UserAPI  from '../api/UserAPI';
// import {GlobalState} from '../GlobalState'
// import { useNavigate } from "react-router-dom";
// const Menus = [
//   { title: "My Dashboard", src: "Dashboard" },
//   { title: "My Tasks", src: "Tasks", gap: true },
//   { title: "Log Out", src: "Logout" },
// ];



// function DefaultSidebar() {
//   const state = useContext(GlobalState);
//   const token = state.token;
//   const [open, setOpen] = useState(true);
//   const location = useLocation();
//   const navigate = useNavigate();
//   const [activeButton, setActiveButton] = useState('dashboard');
//   const { logoutUser } = useMemo(() => UserAPI(token), [token]); 

//   const handleLogout = () => {
//     logoutUser();
//     // Clear any stored user data if necessary
//     // Redirect to login page
//     navigate('/login');
//   };


//   useEffect(() => {
//     if (location.pathname === '/dashboard') {
//       setActiveButton('dashboard');
//     } else if (location.pathname === '/tasks') {
//       setActiveButton('tasks');
//     }
//   }, [location])

//   return (
//     <div className="flex max-h-full">
//       <div className={` ${open ? "w-72" : "w-20 "} bg-gray-50 shadow-xl h-full pt-8 relative duration-300`}>
//         {/* <img
//           src="/assets/control.png"
//           className={`absolute cursor-pointer -right-3 top-9 w-7 border-dark-purple
//  border-2 rounded-full ${!open && "rotate-180"}`}
//           onClick={() => setOpen(!open)}
//         /> */}
//         <div className="flex pl-4 gap-x-4 items-center">
//           {/* <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 512 512"><path d="M0 96C0 60.7 28.7 32 64 32l384 0c35.3 0 64 28.7 64 64l0 320c0 35.3-28.7 64-64 64L64 480c-35.3 0-64-28.7-64-64L0 96zm64 64l0 256 160 0 0-256L64 160zm384 0l-160 0 0 256 160 0 0-256z"/></svg> */}
//           <h1
//             className={`text-white origin-left font-bold text-3xl duration-200 ${!open && "scale-0"
//               }`}
//           >
//             <span className="text-indigo-600">Em</span>
//             <span className="text-black">Flow</span>
//           </h1>
//         </div>
//         <div className="flex flex-col justify-between">
//           <div>
//             <ul className="pt-6">
//               {/* {Menus.map((Menu, index) => (
//             <li
//               key={index}
//               className={`flex rounded-md p-2 cursor-pointer hover:bg-light-white text-gray-300 text-sm items-center gap-x-4 
//  ${Menu.gap ? "mt-9" : "mt-2"} ${index === 0 && "bg-light-white"
//                 } `}
//             >
//               <img src={`.../assets/${Menu.src}.svg`} />
//               <span className={`${!open && "hidden"} origin-left duration-200`}>
//                 {Menu.title}
//               </span>
//             </li>
//           ))} */}
//               <Link to={'/dashboard'}>

//                 <li
//                   className={`flex font-semibold p-3 cursor-pointer ${activeButton === 'dashboard' ? 'bg-indigo-700' : 'bg-indigo-400'}  text-white text-base items-center gap-x-4 mt-2 transition-colors duration-300 ease-in-out`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
//                     <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
//                   </svg>
//                     <span className={`${!open && "hidden"} origin-left duration-200`}>
//                       My Dashboard
//                     </span>
//                 </li>
//               </Link>
//               <Link to={'/tasks'}>
//                 <li
//                   className={`flex font-semibold p-3 cursor-pointer ${activeButton === 'tasks' ? 'bg-indigo-700' : 'bg-indigo-400'}  text-white text-base items-center gap-x-4 transition-colors duration-300 ease-in-out`}
//                 >
//                   <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
//                     <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
//                   </svg>
//                     <span className={`${!open && "hidden"} origin-left duration-200`}>
//                       My Tasks
//                     </span>
//                 </li>
//               </Link>
//             </ul>

//           </div>
//           <div>
//             <ul>
//               <li
//                 className="flex font-semibold mt-96 p-3 cursor-pointer bg-red-500 hover:bg-red-600 text-white text-base items-center gap-x-4 transition-colors duration-300 ease-in-out"
//                 onClick={handleLogout}
//               >
//                 <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
//                   <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
//                 </svg>
//                 <span className={`${!open && "hidden"} origin-left duration-200`}>
//                   Log Out
//                 </span>
//               </li>
//             </ul>
//           </div>
//         </div>
//       </div>
//     </div>
//   );
// }
// export default DefaultSidebar;
import {
  Card,
  Typography,
  List,
  ListItem,
  ListItemPrefix,
  ListItemSuffix,
  Chip,
} from "@material-tailwind/react";
import { useState, useEffect, useContext, useMemo } from "react";
import { Link, useLocation } from "react-router-dom";
import UserAPI from '../api/UserAPI';
import { GlobalState } from '../GlobalState';
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion"; // Add framer-motion for animations
import { Ticket } from "lucide-react"; // Import Ticket icon from lucide-react

function DefaultSidebar({ onToggle }) {
  const state = useContext(GlobalState);
  const token = state.token;
  const [open, setOpen] = useState(true);
  const location = useLocation();
  const navigate = useNavigate();
  const [activeButton, setActiveButton] = useState('dashboard');
  const { logoutUser } = useMemo(() => UserAPI(token), [token]);

  // Call the onToggle callback whenever open state changes
  useEffect(() => {
    if (onToggle) {
      onToggle(open);
    }
  }, [open, onToggle]);
  
  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  useEffect(() => {
    if (location.pathname === '/dashboard') {
      setActiveButton('dashboard');
    } else if (location.pathname === '/tasks') {
      setActiveButton('tasks');
    }
    else if(location.pathname === '/tickets'){
      setActiveButton('tickets')
    }
  }, [location]);

  // Animation variants
  const sidebarVariants = {
    open: { width: "270px" },
    closed: { width: "80px" }
  };

  const menuItemVariants = {
    open: { opacity: 1, x: 0 },
    closed: { opacity: 0, x: -10 }
  };

  return (
    <motion.div 
      className="h-screen fixed left-0 top-0 z-40"
      initial="open"
      animate={open ? "open" : "closed"}
      variants={sidebarVariants}
      transition={{ duration: 0.3, ease: "easeInOut" }}
    >
      <div className="flex flex-col h-full bg-gradient-to-b from-gray-50 to-gray-100 shadow-xl relative">
        {/* Toggle Button */}
        <button 
          className="absolute -right-3 top-10 bg-indigo-600 rounded-full p-1 shadow-lg z-50 hover:bg-indigo-700 transition-colors"
          onClick={() => setOpen(!open)}
        >
          <motion.svg
            width="20"
            height="20"
            viewBox="0 0 20 20"
            fill="none"
            xmlns="http://www.w3.org/2000/svg"
            animate={{ rotate: open ? 0 : 180 }}
            transition={{ duration: 0.3 }}
          >
            <path
              d="M12.5 15L7.5 10L12.5 5"
              stroke="white"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </motion.svg>
        </button>

        {/* Header */}
        <div className="flex items-center p-5 border-b border-gray-200">
          <motion.div
            className="flex items-center space-x-2"
            animate={{ opacity: 1 }}
            initial={{ opacity: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="w-10 h-10 rounded-lg bg-indigo-600 flex items-center justify-center">
              <span className="text-white font-bold text-xl">E</span>
            </div>
            <motion.div 
              className="font-bold text-2xl"
              animate={{ opacity: open ? 1 : 0, scale: open ? 1 : 0 }}
              transition={{ duration: 0.2 }}
            >
              <span className="text-indigo-600">Em</span>
              <span className="text-gray-800">Flow</span>
            </motion.div>
          </motion.div>
        </div>

        {/* Main Navigation - Takes all available space with flex-grow */}
        <div className="flex-grow overflow-y-auto py-4 px-2">
          <h2 className={`text-xs uppercase text-gray-500 font-semibold mb-3 px-3 ${!open && "text-center"}`}>
            {open ? "Navigation" : "Nav"}
          </h2>
          <ul className="space-y-2">
            <li>
              <Link to="/dashboard">
                <motion.div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    activeButton === 'dashboard' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-100'
                  } transition-all duration-200 ease-in-out group`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z" clipRule="evenodd" />
                  </svg>

                  {open && (
                    <motion.span 
                      className="ml-3 font-medium"
                      variants={menuItemVariants}
                    >
                      Dashboard
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </li>
            
            <li>
              <Link to="/tasks">
                <motion.div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    activeButton === 'tasks' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-100'
                  } transition-all duration-200 ease-in-out group`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
                    <path fillRule="evenodd" d="M6.32 2.577a49.255 49.255 0 0 1 11.36 0c1.497.174 2.57 1.46 2.57 2.93V21a.75.75 0 0 1-1.085.67L12 18.089l-7.165 3.583A.75.75 0 0 1 3.75 21V5.507c0-1.47 1.073-2.756 2.57-2.93Z" clipRule="evenodd" />
                  </svg>

                  {open && (
                    <motion.span 
                      className="ml-3 font-medium"
                      variants={menuItemVariants}
                    >
                      Tasks
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </li>

            {/* New Tickets Menu Item */}
            <li>
              <Link to="/tickets">
                <motion.div
                  className={`flex items-center p-3 rounded-lg cursor-pointer ${
                    activeButton === 'tickets' ? 'bg-indigo-600 text-white' : 'text-gray-700 hover:bg-indigo-100'
                  } transition-all duration-200 ease-in-out group`}
                  whileHover={{ x: 5 }}
                  whileTap={{ scale: 0.95 }}
                >
                  <Ticket className="h-5 w-5" />

                  {open && (
                    <motion.span 
                      className="ml-3 font-medium"
                      variants={menuItemVariants}
                    >
                      Tickets
                    </motion.span>
                  )}
                </motion.div>
              </Link>
            </li>
          </ul>
        </div>

        {/* Footer with fixed position at the bottom */}
        <div className="border-t border-gray-200 p-2 mt-auto">
          <motion.button
            className={`w-full flex items-center p-3 rounded-lg text-white bg-red-500 hover:bg-red-600 transition-colors duration-200`}
            onClick={handleLogout}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" className="size-6">
              <path fillRule="evenodd" d="M16.5 3.75a1.5 1.5 0 0 1 1.5 1.5v13.5a1.5 1.5 0 0 1-1.5 1.5h-6a1.5 1.5 0 0 1-1.5-1.5V15a.75.75 0 0 0-1.5 0v3.75a3 3 0 0 0 3 3h6a3 3 0 0 0 3-3V5.25a3 3 0 0 0-3-3h-6a3 3 0 0 0-3 3V9A.75.75 0 1 0 9 9V5.25a1.5 1.5 0 0 1 1.5-1.5h6ZM5.78 8.47a.75.75 0 0 0-1.06 0l-3 3a.75.75 0 0 0 0 1.06l3 3a.75.75 0 0 0 1.06-1.06l-1.72-1.72H15a.75.75 0 0 0 0-1.5H4.06l1.72-1.72a.75.75 0 0 0 0-1.06Z" clipRule="evenodd" />
            </svg>

            {open && (
              <motion.span 
                className="ml-3 font-medium"
                variants={menuItemVariants}
              >
                Logout
              </motion.span>
            )}
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
}

export default DefaultSidebar;