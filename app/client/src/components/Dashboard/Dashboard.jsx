import "./Dashboard.scss";
import DataTable from './DataTable/DataTable';
import {userColumns, activityColumns} from "./DataTable/columns";
import "./Dashboard.scss";
import { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getUsers } from "../../features/user/userSlice";

const Dashboard = () => {
  const {users} = useSelector(state => state.user)
  const {activities} = useSelector(state => state.activity)
  const dispatch = useDispatch()
  
  useEffect(() => {
      dispatch(getUsers())
  }, [dispatch])

  return (
    <div className='dashboard'>
      <DataTable kind="users" columns={userColumns} rows={users} />
      <DataTable kind="activities" columns={activityColumns} rows={activities} />
    </div>
  )
}
export default Dashboard