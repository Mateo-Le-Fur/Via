import { useSelector } from 'react-redux'
import { Navigate } from "react-router-dom"

const ProtectedRoute = ({children}) => {
const {user, checking} = useSelector(state => state.auth)

if(checking){
    return <p>Loading...</p>
}

 if(!checking && !user){
  return <Navigate to="/" />
 }


 return children
}
export default ProtectedRoute