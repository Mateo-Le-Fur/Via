import { useSelector, useDispatch } from 'react-redux'
import { Navigate } from "react-router-dom"
import { useEffect } from 'react'
import { checkUser } from '../features/auth/authSlice'
import Spinner from '../components/Spinner/Spinner'

const ProtectedRoute = ({children}) => {
const {user, isLoading, isError, message} = useSelector(state => state.auth)



 if(!isLoading && !user){
  return <Navigate to="/" />
 }


 return children
}
export default ProtectedRoute