import { useState, useMemo, useCallback } from "react";
import { DataGrid } from "@mui/x-data-grid";
import { TextField, Box, Paper } from "@mui/material";
import { Search } from "@mui/icons-material";

const Table = ({
  rows,
  columns,
  onRowDoubleClick,
  hide = {},
  getRowClassName,
  styles,
}) => {
  const [searchText, setSearchText] = useState("");
  const [pageSize, setPageSize] = useState(7);

  // Memoize filtered rows to prevent unnecessary recalculations
  const filteredRows = useMemo(() => {
    if (!searchText) return rows;

    const searchLower = searchText.toLowerCase();
    return rows.filter((row) =>
      // Check if any column value contains the search text
      columns.some((column) => {
        const value = row[column.field];
        return value && value.toString().toLowerCase().includes(searchLower);
      })
    );
  }, [rows, columns, searchText]);

  // Debounced search handler to prevent excessive re-renders
  const handleSearchChange = useCallback((event) => {
    setSearchText(event.target.value);
  }, []);
  const handleRowDoubleClick = (params) => {
    onRowDoubleClick(params.row);
  };
  let options = null;
  if (onRowDoubleClick) {
    options = {
      cursor: "pointer",
      "& .MuiDataGrid-row:hover": {
        backgroundColor: "rgba(0, 0, 0, 0.04)",
      },
      "& .MuiDataGrid-cell": {
        cursor: "pointer",
      },
    };
  }

  return (
    <Paper className="p-2 fadeIn">
      <Box sx={{ display: "flex", alignItems: "flex-end", mb: 2 }}>
        <Search sx={{ color: "action.active", mr: 1, my: 0.5 }} />
        <TextField
          label="Search table"
          variant="standard"
          value={searchText}
          onChange={handleSearchChange}
          sx={{
            "& .MuiInput-underline:after": {
              borderBottomColor: "#f59e0b", // Your main color
            },
            "& .MuiInputLabel-root.Mui-focused": {
              color: "#f59e0b",
            },
          }}
        />
      </Box>

      <DataGrid
        {...(onRowDoubleClick && {
          onRowDoubleClick: handleRowDoubleClick,
        })}
        rows={filteredRows}
        columns={columns}
        onRowDoubleClick={onRowDoubleClick}
        getRowClassName={getRowClassName}
        pagination
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize },
          },
          columns: {
            columnVisibilityModel: {
              id: false,
              ...hide,
            },
          },
          filter: {
            filterModel: {
              items: [], // Start with no filters
            },
          },
        }}
        pageSizeOptions={[5, 7, 10, 15, 20]}
        onPaginationModelChange={(model) => setPageSize(model.pageSize)}
        disableRowSelectionOnClick
        sx={{
          "& .MuiDataGrid-cell:focus": {
            outline: "none",
          },
          ...options,
          ...styles,
        }}
      />
    </Paper>
  );
};

export default Table;
