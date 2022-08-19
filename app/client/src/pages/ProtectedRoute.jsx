import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom"


const ProtectedRoute = ({children}) => {
const {user, isLoading, message} = useSelector(state => state.auth)



 if((!isLoading && !user) || message === "déconnecté"){
  return <Navigate to="/" />
 }


 return children
}
export default ProtectedRoute