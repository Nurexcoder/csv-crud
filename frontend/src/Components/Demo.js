import * as React from "react";
import { DataGrid, GridToolbarFilterButton } from "@mui/x-data-grid";
import { useDemoData } from "@mui/x-data-grid-generator";
import { Box, Button, Modal } from "@mui/material";
import Edit from "./Edit";

function loadServerRows(page, data) {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(data.rows.slice(page * 5, (page + 1) * 5));
    }, Math.random() * 500 + 100); // simulate network latency
  });
}

export default function Demo({
  rows,
  setRows,
  getData,
  setPaginationModel,
  setRowSelectionModel,
  loading,
  paginationModel,
  rowSelectionModel,
  totalRows,
  deleteRow,
  filterModel,
  setFilterModel,
  searchItem,
}) {
  const [open, setOpen] = React.useState(false);
  const [editData, setEditData] = React.useState({});

  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleEdit = (row) => {
    console.log(row);
    setEditData({
      film: row["Film"],
      genre: row["Genre"],
      leadStudio: row["Lead Studio"],
      audienceScore: row["Audience score %"],
      profitibity: row["Profitability"],
      rottenTomato: row["Rotten Tomatoes %"],
      worldWideGross: row["Worldwide Gross"],
      year: row["Year"],
    });
    handleOpen();
  };
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
      type: "number",
    },
    {
      field: "Audience score %",
      headerName: "Audience score %",
      width: 110,
      type: "number",
    },
    {
      field: "Profitability",
      headerName: "Profitability",
      width: 160,
      type: "number",
    },
    {
      field: "Rotten Tomatoes %",
      type: "number",
      headerName: "Rotten Tomatoes %",
      width: 160,
    },
    {
      field: "Worldwide Gross",
      headerName: "Worldwide Gross",
      width: 160,
      type: "number",
    },
    {
      field: "Year",
      headerName: "Year",
      width: 160,
      type: "number",
    },
    {
      field: "Action",
      headerName: "Action",
      width: 360,
      renderCell: (rows) => (
        <Box
          sx={{
            width: "400px",
          }}
        >
          <Button
            color="error"
            variant="outlined"
            onClick={() => deleteRow(rows.id)}
          >
            Delete
          </Button>
          <Button
            color="primary"
            variant="outlined"
            onClick={() => handleEdit(rows.row)}
            sx={{
              mx: 2,
            }}
          >
            Edit
          </Button>
        </Box>
      ),
    },
  ];

  console.log(rowSelectionModel);
  const onFilterChange = React.useCallback((filterModelCur) => {
    console.log(filterModelCur);
    setFilterModel(filterModelCur.items);
  }, []);

  console.log(filterModel);

  return (
    <div style={{ height: "calc(100vh - 50px)", width: "100%" }}>
      <DataGrid
        columns={columns}
        rows={rows}
        pagination
        // checkboxSelection
        paginationModel={paginationModel}
        pageSizeOptions={[5]}
        rowCount={totalRows}
        paginationMode="server"
        onPaginationModelChange={setPaginationModel}
        onRowSelectionModelChange={(newRowSelectionModel) => {
          setRowSelectionModel(newRowSelectionModel);
        }}
        rowSelectionModel={rowSelectionModel}
        loading={loading}
        slots={{
          toolbar: GridToolbarFilterButton,
        }}
        filterMode="server"
        onFilterModelChange={onFilterChange}
        keepNonExistentRowsSelected
      />
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Edit
          getData={getData}
          handleModalClose={handleClose}
          editData={editData}
        />
      </Modal>
    </div>
  );
}
