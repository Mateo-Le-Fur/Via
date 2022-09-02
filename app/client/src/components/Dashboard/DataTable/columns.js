export const userColumns = [
    { field: "id", headerName: "ID", width: 5 },
    {
      field: "user",
      headerName: "Utilisteur",
      width: 110,
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
      width: 110,
    },
  ];
  
  
  export const activityColumns = [
    { field: "id", headerName: "ID", width: 5 },
    {
      field: "name",
      headerName: "Activité",
      width: 110,
    },
    {
      field: "user_id",
      headerName: "Id utilisateur",
      width: 110,
    },
  ];
  
  