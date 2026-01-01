import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
import { useParams, useNavigate } from "react-router-dom"; // ✅ Added useNavigate
import {
  TextField,
  CircularProgress,
  InputAdornment,
  Box,
  Button,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import axios from "axios";
import debounce from "lodash.debounce";
import { GridToolbar } from "@mui/x-data-grid/internals";

const GenericTable = ({
  title,
  columns,
  apiEndpoint,
  searchPlaceholder = "Search...",
  rowId = "id",
  description = "Description..",
  addNew,
  onRowClick,
  onRowDoubleClick,
  initialFilters,
  customStyles,
  getRowClassName,
}) => {
  const paramss = useParams();
  const navigate = useNavigate(); // ✅ Initialize navigate hook here
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterModel, setFilterModel] = useState(
    initialFilters || { items: [] }
  );

  // --- Internal State ---
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [sortModel, setSortModel] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  const debouncedSetSearch = useMemo(
    () => debounce((value) => setDebouncedSearch(value), 1000),
    []
  );

  useEffect(() => {
    debouncedSetSearch(searchTerm);
  }, [searchTerm, debouncedSetSearch]);

  const CustomNoRowsOverlay = () => (
    <GridOverlay sx={{ flexDirection: "column", gap: 1 }}>
      <Box sx={{ mt: 1, color: "#94a3b8" }}>
        No results found for your filters
      </Box>
      <Button
        size="small"
        onClick={() => {
          setFilterModel({ items: [] });
          setSearchTerm("");
        }}
        sx={{ color: "#f59e0b", textTransform: "none" }}
      >
        Clear all filters
      </Button>
    </GridOverlay>
  );

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      let finalUrl = apiEndpoint;
      Object.keys(paramss).forEach((key) => {
        finalUrl = finalUrl.replace(`:${key}`, paramss[key]);
      });
      const queryParams = {
        page: paginationModel.page + 1,
        limit: paginationModel.pageSize,
        search: debouncedSearch,
        sortBy: sortModel[0]?.field || rowId,
        orderBy: sortModel[0]?.sort || "asc",
      };

      filterModel.items.forEach((item) => {
        if (
          item.value !== undefined &&
          item.value !== null &&
          item.value !== ""
        ) {
          const operatorMap = {
            ">=": "From",
            ">": "From",
            "<=": "To",
            "<": "To",
            "=": "",
            onOrAfter: "From",
            onOrBefore: "To",
            is: "",
            contains: "",
            equals: "",
          };
          const suffix = operatorMap[item.operator] || "";
          const paramKey = `${item.field}${suffix}`;
          let finalValue = item.value;
          if (item.value instanceof Date) {
            finalValue = item.value.toISOString().split("T")[0];
          }
          queryParams[paramKey] = finalValue;
        }
      });

      const response = await axios.get(`http://localhost:5000${finalUrl}`, {
        params: queryParams,
      });

      setRows(response.data.data || []);
      setRowCount(response.data.pagination?.total || 0);
    } catch (error) {
      console.error(`Error fetching from ${apiEndpoint}:`, error);
    } finally {
      setLoading(false);
    }
  }, [
    apiEndpoint,
    paginationModel,
    sortModel,
    debouncedSearch,
    filterModel,
    paramss,
    rowId,
  ]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCellClick = (params) => {
    const valueToCopy = params.value;
    if (valueToCopy && typeof valueToCopy !== "object") {
      navigator.clipboard.writeText(valueToCopy.toString());
    }
  };

  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden w-full animate-slide-up">
      <div className="px-6 py-4 flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-50">
        <div>
          {title && (
            <h2 className="text-xl font-bold text-slate-800 tracking-tight">
              {title}
            </h2>
          )}
          {description && (
            <p className="text-sm text-slate-500 mt-1">{description}</p>
          )}
        </div>

        <div className="flex items-center gap-3">
          <TextField
            placeholder={searchPlaceholder}
            size="small"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            sx={{
              "& .MuiOutlinedInput-root": {
                borderRadius: "8px",
                backgroundColor: "#f8fafc",
                "&.Mui-focused fieldset": { borderColor: "#f59e0b" },
              },
              width: { xs: "100%", md: "300px" },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: "#94a3b8", fontSize: "20px" }} />
                </InputAdornment>
              ),
            }}
          />
          {addNew && (
            <button
              onClick={addNew}
              className="cursor-pointer bg-[#f59e0b] hover:bg-[#d97706] text-white px-4 py-2 rounded-lg font-medium transition-colors duration-200 text-sm flex items-center gap-2 shrink-0"
            >
              + Add New
            </button>
          )}
        </div>
      </div>

      <div className="h-[500px] w-full p-2">
        <DataGrid
          getRowClassName={getRowClassName ? getRowClassName : () => ""}
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
          filterMode="server"
          filterModel={filterModel}
          onCellClick={handleCellClick}
          rows={rows}
          columns={columns}
          rowCount={rowCount}
          loading={loading}
          paginationMode="server"
          sortingMode="server"
          paginationModel={paginationModel}
          onPaginationModelChange={setPaginationModel}
          pageSizeOptions={[5, 10, 20]}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          getRowId={(row) => row[rowId]}
          disableRowSelectionOnClick
          onRowClick={(params) =>
            onRowClick && onRowClick(params.row, navigate)
          } // ✅ Passed navigate
          onRowDoubleClick={
            (params) =>
              onRowDoubleClick && onRowDoubleClick(params.row, navigate) // ✅ Passed navigate
          }
          sx={{
            border: "none",
            fontFamily: "inherit",
            fontSize: "0.875rem",
            color: "#334155",
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              fontSize: "0.75rem",
              borderBottom: "1px solid #f1f5f9",
            },
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f1f5f9",
              padding: "12px 16px",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fffbeb",
              cursor: "pointer",
            },
            "& .MuiDataGrid-cell:focus": { outline: "none" },
            "& .MuiDataGrid-cell:focus-within": {
              outline: "1px solid #f59e0b",
              outlineOffset: "-1px",
            },
            "& .MuiDataGrid-columnHeader:focus, & .MuiDataGrid-columnHeader:focus-within":
              {
                outline: "none",
              },
            ...customStyles,
          }}
          slots={{
            toolbar: GridToolbar,
            noRowsOverlay: CustomNoRowsOverlay,
            loadingOverlay: () => (
              <GridOverlay className="bg-white/80 backdrop-blur-[1px]">
                <CircularProgress sx={{ color: "#f59e0b" }} size={30} />
              </GridOverlay>
            ),
          }}
        />
      </div>
    </div>
  );
};

export default GenericTable;
