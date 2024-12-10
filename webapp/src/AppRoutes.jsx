import React, { useContext, useEffect } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom';
import ProtectedRoute from './ProtectedRoute';
import AdminDashboard from './components/dashboard/AdminDashboard';
import SignInLayout from './components/login/Layout';
import { isTokenValid } from './utils/jwt';
import { AppContext } from './contexts/AppContext';
import { USER } from './utils/actionType';
import Dashboard from './components/dashboard/Dashboard';
export default function AppRoutes(props) {
  const { state, dispatch } = useContext(AppContext)
  useEffect(() => {
    let webStorage = localStorage.getItem("web-app-storage") || null
    if (webStorage) {
      let token = isTokenValid(JSON.parse(webStorage)?.token)
      if (token?.isValid) {
        dispatch({ type: USER, payload: { data: { ...JSON.parse(webStorage), claims: token?.payload }, isAuthenticated: true } })
      } else {
        dispatch({ type: USER, payload: { data: [], isAuthenticated: false } })
      }
    }
    else {
      dispatch({ type: USER, payload: { data: [], isAuthenticated: false } })
    }
  }, [])
  return (
    <Routes>
      <Route path='/' element={<ProtectedRoute/>}>
        <Route path="/home" element={<Dashboard />} />
        <Route path="/admin" element={<AdminDashboard/>} />
        <Route index element={<Dashboard />} />
      </Route>
      <Route path="/login" element={<SignInLayout />} />
    </Routes>
  )
}
