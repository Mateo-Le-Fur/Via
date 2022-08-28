import "../Dashboard.scss";
import { DataGrid, frFR } from "@mui/x-data-grid";
import { deleteUser } from "../../../features/user/userSlice";
import { useDispatch } from "react-redux";
import { deleteActivity } from "../../../features/activity/activitySlice";


const DataTable = ({kind, columns, rows}) => {
  const dispatch = useDispatch()
    const handleDelete = (id) => {
      if(kind === "users"){
        dispatch(deleteUser(id))
      } else if (kind === "activities"){
        dispatch(deleteActivity(id))
      }
    }

    const actionColumn = [
        {
          field: "action",
          headerName: "Action",
          width: 90,
          renderCell: (params) => {
            return (
              <div className="cellAction">
                <div
                  className="deleteButton"
                  onClick={() => handleDelete(params.row.id)}
                >
                 supprimer
                </div>
              </div>
            );
          },
        },
      ];
  return (
    <div className="datatable">
      <div className="datatableTitle">
          {(kind === "users") && (
            "Utilisateurs"
          )}
          {(kind === "activities") && (
            "Activités"
          )}
      </div>
  
      <DataGrid
      className='dataGrid'
        rows={rows}
        columns={columns.concat(actionColumn)}
        pageSize={5}
        rowsPerPageOptions={[5]}
        checkboxSelection
        columnBuffer={5}
        localeText={frFR.components.MuiDataGrid.localeText}
      />
  
    </div>
  )
}
export default DataTable