import "./Dashboard.scss";
import DataTable from './DataTable/DataTable';
import {userColumns, activityColumns} from "./DataTable/columns";
import {users, activities} from "./DataTable/data"
import "./Dashboard.scss";

const Dashboard = () => {
  return (
    <div className='dashboard'>
      <DataTable kind="users" columns={userColumns} rows={users} />
      <DataTable kind="activities" columns={activityColumns} rows={activities} />
    </div>
  )
}
export default Dashboard