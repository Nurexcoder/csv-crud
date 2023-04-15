import { Visibility, VisibilityOff } from "@mui/icons-material";
import {
  Backdrop,
  Button,
  CircularProgress,
  IconButton,
  InputAdornment,
  OutlinedInput,
  TextField,
} from "@mui/material";
import React, { useState } from "react";
// import { Link, useNavigate } from "react-router-dom";
import styled from "styled-components";
import Swal from "sweetalert2";
import { url } from "../config";
// import { baseApi } from "../config";

const Component = styled.div`
  width: 100%;
  height: 100vh;
  background-color: #3786e5;
  display: flex;
  justify-content: center;
  align-items: center;
`;
const Form = styled.form`
  width: 100vw;
  height: 70vh;
  border-radius: 41px;
  background: #ffffff;
`;
const Upper = styled.div`
  margin-top: 10px;
  flex: 3;
  width: 100%;
  /* height: 100%; */
`;
const Welcome = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
`;
const H = styled.h1``;
const Mgs = styled.span``;
const Lower = styled.div`
  margin-top: 20px;
  flex: 4;
  display: flex;
  flex-direction: row;
  align-items: center;
  width: 100%;
  align-items: center;
  justify-content: center;
  flex-wrap: wrap;

  /* padding: 20px 40px; */
`;
const LowerMid = styled.div`
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  align-items: center;
  width: 50%;
`;
const InputField = styled(TextField)`
  width: 40%;
  margin: 10px 15px !important;
`;
const InputFieldPassword = styled(OutlinedInput)`
  width: 80%;
  margin: 10px 0 !important;
`;
const SubmitButton = styled(Button)`
  width: 80%;
  margin: 10px 0 !important;
  height: 50px;
`;

const LowerMost = styled.div`
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: space-evenly;
  /* margin: 12px 0; */
`;
const Question = styled.button`
  /* padding: 0.5 rem; */
  margin: 0 0.3em;
`;
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60vw",
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
const CreateNew = ({ getData, handleModalClose }) => {
  // const navigator = useNavigate();
  const [open, setOpen] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setOpen(true);
      var myHeaders = new Headers();
      myHeaders.append("Content-Type", "application/json");

      var raw = JSON.stringify({
        film: e.target.name.value,
        genre: e.target.genre.value,
        leadStudio: e.target.leadStudio.value,
        audienceScore: e.target.audienceScore.value,
        profitibity: e.target.profitibity.value,
        rottenTomato: e.target.rottenTomato.value,
        worldWideGross: e.target.worldWideGross.value,
        year: e.target.year.value,
      });
      console.log(raw);
      //   return
      var requestOptions = {
        method: "POST",
        headers: myHeaders,
        body: raw,
        redirect: "follow",
      };

      fetch(url + "/csv", requestOptions)
        .then((response) => response.text())
        .then((result) => {
          setOpen(false);
          getData();
          handleModalClose();
          console.log(result);
        })
        .catch((error) => console.log("error", error));
    } catch (error) {
      setOpen(false);
      console.log(error);
      // if (error.response.status === 400) {
      //   Swal.fire("Incoorect  ", "Incoorect  password or Username", "error");
      //   return;
      // }

      //   handleModalClose();
      Swal.fire("Error", "Something went wrong", "error");
    }
  };
  return (
    <Form style={style} onSubmit={handleSubmit}>
      <Upper>
        <Welcome>
          <Mgs>Create a new movie data</Mgs>
        </Welcome>
      </Upper>
      <Lower>
        <InputField placeholder="Movie Name" name="name" required />
        <InputField placeholder="Genre" name="genre" required />
        <InputField placeholder="Lead Studio" name="leadStudio" required />
        <InputField
          placeholder="Audience Score"
          name="audienceScore"
          required
        />
        <InputField placeholder="Profibility" name="profitibity" required />
        <InputField
          placeholder="Rotten Tomato %"
          name="rottenTomato"
          required
        />
        <InputField
          placeholder="World Wide Gross $"
          name="worldWideGross"
          required
        />
        <InputField placeholder="Year" name="year" required />

        <SubmitButton type="submit" color="success" variant="contained">
          Submit
        </SubmitButton>
      </Lower>

      {/* Click here */}
      {/* </Link> */}
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={open}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
    </Form>
  );
};

export default CreateNew;
