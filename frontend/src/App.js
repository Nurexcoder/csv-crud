import logo from "./logo.svg";
import "./App.css";
import Table from "./Components/Table";
import { useEffect, useState } from "react";
import { url } from "./config";
import Demo from "./Components/Demo";
import Appbar from "./Components/Appbar";

function App() {
  const [rows, setRows] = useState([]);
  const [paginationModel, setPaginationModel] = useState({
    page: 0,
    pageSize: 10,
  });
  const [loading, setLoading] = useState(false);
  const [rowSelectionModel, setRowSelectionModel] = useState([]);
  const [totalRows, setTotalRows] = useState(0);
  const [filterModel, setFilterModel] = useState([]);
  const [searchValue, setSearchValue] = useState("");
  const getData = () => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");
    setLoading(true);
    var requestOptions = {
      method: "GET",
      headers: myHeaders,
      redirect: "follow",
    };
    if (filterModel && filterModel?.length) {
      let params = "";
      filterModel.map((item, i) => {
        if (i != filterModel.length - 1)
          params += item.field + "=" + item.value + "&";
        else params += item.field + "=" + item.value;
      });

      fetch(
        url + "/csv/" + paginationModel.page + "/search?" + params,
        requestOptions
      )
        .then((response) => response.json())
        .then((result) => {
          setRows(result.results);
          setTotalRows(result.count);
          console.log(result);
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    } else {
      fetch(url + "/csv/page/" + paginationModel.page, requestOptions)
        .then((response) => response.json())
        .then((result) => {
          setRows(result.results);
          setTotalRows(result.count);
          console.log(result);
          setLoading(false);
        })
        .catch((error) => console.log("error", error));
    }
  };

  const deleteRow = (id) => {
    var myHeaders = new Headers();
    myHeaders.append("Content-Type", "application/json");

    var requestOptions = {
      method: "DELETE",
      headers: myHeaders,
      redirect: "follow",
    };

    fetch(url + "/csv/" + (id - 1), requestOptions)
      .then((response) => response.text())
      .then((result) => {
        getData();
      })
      .catch((error) => console.log("error", error));
  };
  const searchItem = (value) => {
    var requestOptions = {
      method: "GET",
      redirect: "follow",
    };
    const newValue = searchValue ? searchValue : "--";

    fetch(
      url + "/csv/search/" + newValue + "/" + paginationModel.page,
      requestOptions
    )
      .then((response) => response.json())
      .then((result) => {
        setRows(result.results);
        setTotalRows(result.count);
      })
      .catch((error) => console.log("error", error));
  };
  useEffect(() => {
    if (searchValue === "") {
      getData();
    } else {
      searchItem(searchValue);
    }
  }, [paginationModel, filterModel, searchValue]);

  return (
    <div className="component">
      <Appbar
        getData={getData}
        searchItem={searchItem}
        setSearchValue={setSearchValue}
      />
      <Demo
        rows={rows}
        setRows={setRows}
        getData={getData}
        setPaginationModel={setPaginationModel}
        loading={loading}
        setRowSelectionModel={setRowSelectionModel}
        rowSelectionModel={rowSelectionModel}
        paginationModel={paginationModel}
        totalRows={totalRows}
        deleteRow={deleteRow}
        filterModel={filterModel}
        setFilterModel={setFilterModel}
      />
    </div>
  );
}

export default App;
