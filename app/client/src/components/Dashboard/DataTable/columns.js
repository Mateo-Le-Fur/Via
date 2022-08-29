export const userColumns = [
    { field: "id", headerName: "ID", width: 10 },
    {
      field: "user",
      headerName: "Utilisteur",
      width: 120,
      renderCell: (params) => {
        return (
          <div className="cellWithImg">
            <img className="cellImg" src={params.row.avatar} alt="avatar" />
            {params.row.nickname}
          </div>
        );
      },
    },
    {
      field: "email",
      headerName: "Email",
      width: 120,
    },
    {
      field: "phone",
      headerName: "Téléphone",
      width: 100
    }
  ];
  
  
  export const activityColumns = [
    { field: "id", headerName: "ID", width: 40 },
    {
      field: "name",
      headerName: "Activité",
      width: 120,
    },
    {
      field: "type",
      headerName: "Type",
      width: 120
    },
    {
      field: "user_id",
      headerName: "Id utilisateur",
      width: 120,
    },
  ];
  
  