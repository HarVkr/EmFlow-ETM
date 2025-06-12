import React from 'react';
import { Navigate } from 'react-router-dom';
import { useContext } from 'react';
import { GlobalState } from '../GlobalState';

const PrivateRoute = ({ children }) => {
  const state = useContext(GlobalState);
  const [isLogged] = state.isLogged;
  
  // Check if user is logged in, if not, redirect to login page
  return isLogged ? children : <Navigate to="/login" replace />;
};

export default PrivateRoute;