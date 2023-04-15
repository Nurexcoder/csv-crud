const express = require("express");
const csv = require("csv-parser");
const fs = require("fs");
const path = require("path");
const { Readable } = require("stream");
const stringify = require("csv-stringify");
console.log(__dirname);
const filePath = path.join(__dirname, "..", "files", "movies.csv");
const createCsvWriter = require("csv-writer").createObjectCsvWriter;

const router = express.Router();
router.get("/pagination/:start", async (req, res) => {
  const jsonArray = [];
  console.log(filePath);
  const startRow = parseInt(req.params.start); // set the starting row (0-indexed)
  const endRow = 10 + startRow;
  // set the ending row (0-indexed)
  console.log(startRow, endRow);
  fs.createReadStream(filePath, { start: startRow, end: endRow })
    .pipe(csv())
    .on("data", (data, i) => {
      console.log(i);
      jsonArray.push(data);
    })
    .on("end", () => {
      console.log(jsonArray);
      res.json(jsonArray);
    });
});
router.get("/page/:start", async (req, res) => {
  try {
    const pageSize = 10; // set the number of records to return per page
    const pageNumber = parseInt(req.params.start); // set the page number to start at (0-based index)

    const results = [];
    let count = 0;
    // console.log()
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => {
        if (
          count >= pageNumber * pageSize &&
          count < (pageNumber + 1) * pageSize
        ) {
          data.id = count + 1;
          results.push(data);
          console.log((pageNumber + 1) * pageSize);
        }
        count++;
      })
      .on("end", () => {
        // console.log(results);
        res.status(200).json({ results, count });
      });
  } catch (error) {
    res.status(500).json({ error: "Something went wrong" });
  }
});

router.post("/", async (req, res) => {
  try {
    const {
      film,
      genre,
      leadStudio,
      audienceScore,
      profitibity,
      rottenTomato,
      worldWideGross,
      year,
    } = req.body;
    const data =
      film +
      "," +
      genre +
      "," +
      leadStudio +
      "," +
      audienceScore +
      "," +
      profitibity +
      "," +
      rottenTomato +
      "," +
      worldWideGross +
      "," +
      year +
      "\n";
    console.log(data);
    fs.appendFile(filePath, data, (err) => {
      if (err) throw err;
      console.log("Data appended to file");
      res.json({ success: "Successfully updated" });
    });
  } catch (error) {}
});
router.delete("/:id", async (req, res) => {
  try {
    const rowIndexToDelete = req.params.id;

    // Create a temporary array to store the modified data
    const newData = [];
    let counter = 0;
    // Create a read stream to read the data from the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // If the current row is not the one we want to delete, add it to the new data array
        if (counter++ != rowIndexToDelete) {
          newData.push(row);
        }
      })
      .on("end", () => {
        // Write the new data array to the CSV file
        fs.writeFileSync(filePath, "");
        fs.writeFileSync(
          filePath,
          "Film,Genre,Lead Studio,Audience score %,Profitability,Rotten Tomatoes %,Worldwide Gross,Year\n"
        ); // Replace with your header row
        newData.forEach((row) => {
          fs.appendFileSync(filePath, `${Object.values(row).join(",")}\n`);
        });
        res.send(`Row ${rowIndexToDelete} has been deleted from ${filePath}`);
      });
  } catch (error) {}
});

router.put("/:id", async (req, res) => {
  try {
    const rowIndexToUpdate = req.params.id;
    const updatedValues = req.body;
    console.log(req.body);
    // Create a temporary array to store the modified data
    const newData = [];
    let counter = 0;
    // Create a read stream to read the data from the CSV file
    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (row) => {
        // If the current row is not the one we want to delete, add it to the new data array
        if (counter++ != rowIndexToUpdate) {
          newData.push(row);
        } else {
          newData.push(updatedValues);
        }
      })
      .on("end", () => {
        // Write the new data array to the CSV file
        fs.writeFileSync(filePath, "");
        fs.writeFileSync(
          filePath,
          "Film,Genre,Lead Studio,Audience score %,Profitability,Rotten Tomatoes %,Worldwide Gross,Year\n"
        ); // Replace with your header row
        newData.forEach((row) => {
          fs.appendFileSync(filePath, `${Object.values(row).join(",")}\n`);
        });
        res.send(`Row ${rowIndexToUpdate} has been updated from ${filePath}`);
      });
  } catch (error) {}
});
router.get("/search/:value/:page", (req, res) => {
  const results = [];
  const partialSearch = req.params.value;
  const pageSize = 10;
  const pageNumber = parseInt(req.params.page);
  let foundCount = 0;
  let count = 0;
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      const obj = data;
      if (partialSearch !== "--") {
        let isFound = false;
        Object.values(obj).filter((value) => {
          if (!isFound && value.includes(partialSearch)) {
            if (
              foundCount >= pageNumber * pageSize &&
              foundCount < (pageNumber + 1) * pageSize
            ) {
              obj.id = count + 1;
              results.push(obj);
              isFound = true;
            }
            foundCount++;
          }
        });
      } else {
        if (
          foundCount >= pageNumber * pageSize &&
          foundCount < (pageNumber + 1) * pageSize
        ) {
          obj.id = count + 1;
          results.push(obj);
          foundCount++;
        }
      }

      count++;
    })
    .on("end", () => {
      
      res.json({ results, count:foundCount });
      console.log(results);
    });
});
router.get("/:pageNo/search", (req, res) => {
  const results = [];
  const partialSearch = req.query;
  let count = 0;
  const pageSize = 10; // set the number of records to return per page
  const pageNumber = parseInt(req.params.pageNo); // set the page number to start at (0-based index)
  let foundCount = 0;
  const isMatched = (value, key) => {
    if (
      key == 0 &&
      (partialSearch["Film"] == "undefined" ||
        value.includes(partialSearch["Film"]))
    )
      return true;
    if (
      key == 1 &&
      (partialSearch["Genre"] === "undefined" ||
        value.includes(partialSearch["Genre"]))
    )
      return true;
    if (
      key == 2 &&
      (partialSearch["Lead%20Studio"] === "undefined" ||
        value.includes(partialSearch["Lead%20Studio"]))
    )
      return true;
    if (
      key == 3 &&
      (partialSearch["Audience%20score%20%"] === "undefined" ||
        value.includes(partialSearch["Audience%20score%20%"]))
    )
      return true;
    if (
      key == 4 &&
      (partialSearch["Profitability"] === "undefined" ||
        value.includes(partialSearch["Profitability"]))
    )
      return true;
    if (
      key == 5 &&
      (partialSearch["Rotten%20Tomatoes%20%"] === "undefined" ||
        value.includes(partialSearch["Rotten%20Tomatoes%20%"]))
    )
      return true;
    if (
      key == 6 &&
      (partialSearch["Worldwide%20Gross"] === "undefined" ||
        value.includes(partialSearch["Worldwide%20Gross"]))
    )
      return true;
    if (
      key == 7 &&
      (partialSearch["Year"] === "undefined" ||
        value.includes(partialSearch["Year"]))
    )
      return true;
    else false;
  };
  fs.createReadStream(filePath)
    .pipe(csv())
    .on("data", (data) => {
      const obj = data;
      let isFound = false;

      Object.values(obj).filter((value, key) => {
        if (
          !isFound &&
          ((partialSearch && partialSearch?.id == count + 1) ||
            isMatched(value, key))
        ) {
          // console.log(obj);
          obj.id = count + 1;
          if (
            foundCount >= pageNumber * pageSize &&
            foundCount < (pageNumber + 1) * pageSize
          ) {
            results.push(obj);
          }
          foundCount++;
          isFound = true;
        }
      });
      count++;
    })
    .on("end", () => {
      res.json({ results, count });
    });
});
module.exports = router;
