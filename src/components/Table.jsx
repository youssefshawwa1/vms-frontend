// import { DataGrid } from "@mui/x-data-grid";
// import "./Table.css";

// const Table = (props) => {
//   // 3. Use state for your data (optional but common)

//   return (
//     <>
//       <DataGrid
//         rows={props.rows}
//         columns={props.columns}
//         initialState={{
//           pagination: {
//             paginationModel: { page: 0, pageSize: 10 },
//           },
//         }}
//         pageSizeOptions={[5, 10, 20, 40]}
//         // sx={{
//         //   display: "inline", // This is the crucial line
//         // }}
//         // checkboxSelection
//       />
//     </>
//   );
// };

// export default Table;

import { useState, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box, Paper } from "@mui/material";
import { Search } from "@mui/icons-material";

const Table = (props) => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(7);

  // Memoize filtered rows to prevent unnecessary recalculations
  const filteredRows = useMemo(() => {
    if (!searchText) return props.rows;

    const searchLower = searchText.toLowerCase();
    return props.rows.filter((row) =>
      // Check if any column value contains the search text
      props.columns.some((column) => {
        const value = row[column.field];
        return value && value.toString().toLowerCase().includes(searchLower);
      })
    );
  }, [props.rows, props.columns, searchText]);

  // Debounced search handler to prevent excessive re-renders
  const handleSearchChange = useCallback((event) => {
    setSearchText(event.target.value);
  }, []);

  return (
    <>
      <Paper className="p-2">
        <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
          <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
          <TextField
            label="Search table"
            variant="standard"
            value={searchText}
            onChange={handleSearchChange}
            fullWidth
          />
        </Box>

        <DataGrid
          rows={filteredRows}
          columns={props.columns}
          pagination
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize },
            },
          }}
          pageSizeOptions={[5, 7, 10, 15, 20]}
          onPaginationModelChange={(model) => setPageSize(model.pageSize)}
          disableColumnMenu
          disableRowSelectionOnClick
          sx={{
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
          }}
        />
      </Paper>
    </>
  );
};

export default Table;
