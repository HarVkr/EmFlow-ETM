import React, { useState, useEffect } from 'react'
import Sidebar from './Sidebar'
import { motion } from 'framer-motion'

export default function Layout({ children }) {
  const [sidebarOpen, setSidebarOpen] = useState(true);
  
  // Function to be passed to Sidebar to track its open/closed state
  const handleSidebarToggle = (isOpen) => {
    setSidebarOpen(isOpen);
  };
  
  return (
    <div className="flex h-screen bg-gray-100 overflow-hidden">
      <Sidebar onToggle={handleSidebarToggle} />
      <motion.main 
        className="flex-1 overflow-y-auto overflow-x-hidden"
        initial={{ marginLeft: "270px" }}
        animate={{ 
        marginLeft: sidebarOpen 
          ? window.innerWidth < 768 ? "0px" : "270px" 
          : window.innerWidth < 768 ? "0px" : "80px" 
      }}
        transition={{ duration: 0.3, ease: "easeInOut" }}
      >
        {children}
      </motion.main>
    </div>
  );
}