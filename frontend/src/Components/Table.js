import * as React from "react";
import Box from "@mui/material/Box";
import { DataGrid } from "@mui/x-data-grid";

const columns = [
  { field: "id", headerName: "ID", width: 90 },
  {
    field: "Film",
    headerName: "Film Name",
    width: 150,
  },
  {
    field: "Lead Studio",
    headerName: "Lead Studio",
    width: 150,
  },
  {
    field: "Audience score %",
    headerName: "Audience score %",
    width: 110,
  },
  {
    field: "Profitability",
    headerName: "Profitability",
    width: 160,
  },
  {
    field: "Rotten Tomatoes %",
    headerName: "Rotten Tomatoes %",
    width: 160,
  },
  {
    field: "Worldwide Gross",
    headerName: "Worldwide Gross",
    width: 160,
  },
  {
    field: "Year",
    headerName: "Year",
    width: 160,
  },
];

export default function Table({ data }) {
  const [page, setPage] = React.useState(0);
  const [pageSize, setPageSize] = React.useState(10);
  return (
    <Box sx={{ height: "100vh", width: "100%" }}>
      <DataGrid
        rows={data}
        columns={columns}
        pagination
        rowCount={10}
        keepNonExistentRowsSelected
        paginationMode="server"
      />
    </Box>
  );
}
