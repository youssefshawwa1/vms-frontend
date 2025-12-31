import React, { useState, useEffect, useCallback, useMemo } from "react";
import { DataGrid, GridOverlay } from "@mui/x-data-grid";
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
}) => {
  const [rows, setRows] = useState([]);
  const [rowCount, setRowCount] = useState(0);
  const [loading, setLoading] = useState(false);
  const [filterModel, setFilterModel] = useState({ items: [] });

  // --- 1. Internal State ---
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 7,
  });
  const [sortModel, setSortModel] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");

  // --- 2. Search Debounce Logic ---
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
  // --- 3. The Fetch Logic (Reusable) ---
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const params = {
        page: paginationModel.page + 1, // Syncing with 1-indexed backend
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
          // We map the MUI operator to a suffix the backend understands
          // Example: date_gt=2025-01-01 or price_lte=100
          const operatorMap = {
            ">=": "From", // Maps age + >= -> ageFrom
            ">": "From",
            "<=": "To", // Maps age + <= -> ageTo
            "<": "To",
            "=": "", // Maps age + = -> age

            // Date Words (from our previous step)
            onOrAfter: "From",
            onOrBefore: "To",
            is: "",

            // String Words
            contains: "",
            equals: "",
          };

          // Get suffix (defaults to empty string if not in map)
          const suffix = operatorMap[item.operator] || "";

          // Construct the key (e.g., "createdAt" + "From" = "createdAtFrom" OR "firstName" + "" = "firstName")
          const paramKey = `${item.field}${suffix}`;

          // Format Date objects to YYYY-MM-DD
          let finalValue = item.value;
          if (item.value instanceof Date) {
            finalValue = item.value.toISOString().split("T")[0];
          }

          params[paramKey] = finalValue;
        }
      });

      const response = await axios.get(`http://localhost:5000${apiEndpoint}`, {
        params,
      });

      // Consistent Backend Contract: { data: [], pagination: { total: 100 } }
      setRows(response.data.data || []);
      setRowCount(response.data.pagination?.total || 0);
    } catch (error) {
      console.error(`Error fetching from ${apiEndpoint}:`, error);
    } finally {
      setLoading(false);
    }
  }, [apiEndpoint, paginationModel, sortModel, debouncedSearch, filterModel]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const handleCellClick = (params, event) => {
    // 1. Get the value of the cell
    const valueToCopy = params.value;

    // 2. Check if the value exists and is not an object
    if (valueToCopy && typeof valueToCopy !== "object") {
      navigator.clipboard.writeText(valueToCopy.toString());

      // Optional: You could trigger a "Copied!" alert or toast here
    }
  };
  return (
    <div className="bg-white rounded-xl shadow-sm border border-slate-100 overflow-hidden m-6 w-full animate-slide-up">
      {/* HEADER SECTION */}
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

      {/* TABLE SECTION */}
      <div className="h-[500px] w-full p-2">
        <DataGrid
          onFilterModelChange={(newModel) => setFilterModel(newModel)}
          filterMode="server" // Crucial: stops local filtering
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
          pageSizeOptions={[5, 10, 20, 50]}
          hideFooterPagination={false}
          sortModel={sortModel}
          onSortModelChange={setSortModel}
          getRowId={(row) => row[rowId]}
          disableRowSelectionOnClick
          onRowClick={(params) => onRowClick && onRowClick(params.row)}
          onRowDoubleClick={(params) =>
            onRowDoubleClick && onRowDoubleClick(params.row)
          }
          sx={{
            border: "none",
            fontFamily: "inherit",
            fontSize: "0.875rem", // Tailwind text-sm
            color: "#334155", // Slate 700

            // Header Styling
            "& .MuiDataGrid-columnHeaders": {
              backgroundColor: "#f8fafc",
              color: "#64748b",
              fontWeight: 700,
              textTransform: "uppercase",
              letterSpacing: "0.025em",
              fontSize: "0.75rem",
              borderBottom: "1px solid #f1f5f9",
            },

            // Row & Cell Styling
            "& .MuiDataGrid-cell": {
              borderBottom: "1px solid #f1f5f9",
              padding: "12px 16px",
            },
            "& .MuiDataGrid-row:hover": {
              backgroundColor: "#fffbeb", // Amber 50 (Very light orange)
              cursor: "pointer",
            },

            // Loading & Progress Styling
            "& .MuiLinearProgress-root": {
              backgroundColor: "#fef3c7", // Amber 100 background
              "& .MuiLinearProgress-bar": { backgroundColor: "#f59e0b" },
            },

            // Pagination Styling
            "& .MuiTablePagination-root": { color: "#64748b" },
            "& .MuiButtonBase-root.Mui-disabled": { color: "#cbd5e1" },
            "& .Mui-selected": { color: "#f59e0b !important" },
            "& .MuiDataGrid-cell:focus": {
              outline: "none",
            },
            // 2. Add your custom orange border on focus (Optional)
            "& .MuiDataGrid-cell:focus-within": {
              outline: "1px solid #f59e0b",
              outlineOffset: "-1px",
            },
            // 3. Remove the blue outline on column headers
            "& .MuiDataGrid-columnHeader:focus": {
              outline: "none",
            },
            "& .MuiDataGrid-columnHeader:focus-within": {
              outline: "none",
            },
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
