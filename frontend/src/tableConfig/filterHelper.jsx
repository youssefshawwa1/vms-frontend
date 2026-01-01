import { getGridSingleSelectOperators } from "@mui/x-data-grid";

export const statusOperators = getGridSingleSelectOperators().filter(
  (op) => op.value === "is"
);
