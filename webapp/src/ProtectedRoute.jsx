import React, { useContext, useEffect } from 'react';
import { Navigate, Outlet, useNavigate } from 'react-router-dom';
import { AppContext } from './contexts/AppContext';
import { USER } from './utils/actionType';
import { isTokenValid } from './utils/jwt';
const ProtectedRoute = () => {
  const { state, dispatch } = useContext(AppContext)
  const navigate = useNavigate()
  useEffect(() => {
    let webStorage = localStorage.getItem("web-app-storage") || null
    if (webStorage) {
      let token = isTokenValid(JSON.parse(webStorage)?.token)
      if (token?.isValid) {
        dispatch({
          type: USER,
          payload: { data: { ...JSON.parse(webStorage), claims: token?.payload }, isAuthenticated: true }
        });
      } else {
        dispatch({
          type: USER,
          payload: { data: [], isAuthenticated: true }
        });
        navigate("/login")
      }
    }
    else {
      navigate("/login")
    }
  }, []);
  return <Outlet />;
}
export default ProtectedRoute;