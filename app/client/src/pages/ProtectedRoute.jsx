import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom"


const ProtectedRoute = ({children}) => {
const {user, isLoading} = useSelector(state => state.auth)



 if(!isLoading && !user){
  return <Navigate to="/" />
 }


 return children
}
export default ProtectedRoute