const express = require("express");
const cors = require("cors");
const csvOpertions = require("./routes/csvOperations");

const app = express();

app.use(cors());
app.use(express.json({ limit: "10mb", extended: true }));
app.use(
  express.urlencoded({ limit: "10mb", extended: true, parameterLimit: 50000 })
);
app.use("/csv", csvOpertions);

app.listen(5000, () => {
  console.log("server started at port 5000");
});
