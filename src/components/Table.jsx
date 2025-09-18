import { DataGrid } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import "./Table.css";

const Table = (props) => {
  // 3. Use state for your data (optional but common)

  return (
    <>
      <DataGrid
        rows={props.rows}
        columns={props.columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10, 20, 40]}
        // sx={{
        //   display: "inline", // This is the crucial line
        // }}
        // checkboxSelection
      />
    </>
  );
};

export default Table;
