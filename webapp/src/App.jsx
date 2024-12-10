import { useReducer, useState } from 'react'
import { BrowserRouter } from 'react-router-dom'
import AppRoutes from './AppRoutes'
import { LOADING, LOGIN_FAILED, LOGIN_SUCCESSFULL, USER } from './utils/actionType'
import {AppContext} from './contexts/AppContext'


const initalState = {
  login: { data: [], isLoading: false, success: false},
  user: { data: [], isAuthenicated: false },
  loading: { isLoading: false }
}

const reducer = (state, action) => {
  switch (action?.type) {
    case LOGIN_SUCCESSFULL:
      return{
        ...state,
        login : {data:action?.payload,isLoading:false,success:true}
      }
    case LOGIN_FAILED:
      return{
        ...state,
        login : {data:action?.payload,isLoading:false,success:false}
      }
    case USER:
      return{
        ...state,
        user:action?.payload
      }
    case LOADING:
      return{
        ...state,
        loading:{isLoading:action?.payload}
      }
    default:
      return{
        ...state
      }
  }
}

function App() {
  const [state, dispatch] = useReducer(reducer, initalState)
  return (
    <AppContext.Provider value={{state,dispatch}}>
       <BrowserRouter
        future={{
          v7_startTransition: true,
          v7_relativeSplatPath: true
        }}
      >
        <AppRoutes />
      </BrowserRouter>
    </AppContext.Provider>
  )
}

export default App
