const express = require("express");
const mongoose = require("mongoose");
const app = express();
require("dotenv").config();
const taskRouter = require("./routes/taskRoute");
const errorHandler = require("./middleware/errorHandler");
const path = require("path");
const cors = require("cors");

const _dirname = path.resolve();
const port = process.env.PORT || 8000;
const url = process.env.mongo_uri;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

//
app.use("/api/task", taskRouter);
app.use(errorHandler);

app.use(express.static(path.join(_dirname, "/client/dist")));
app.get("*", (req, res) => {
  res.sendFile(path.join(_dirname, "client", "dist", "index.html"));
});

//
const connect = async () => {
  try {
    await mongoose.connect(url);
    console.log("connected to db");
    app.listen(port, () => {
      console.log(`Server is running on port: ${port}`);
    });
  } catch (error) {
    console.log(error);
    console.log("could not connect to db");
  }
};

connect();
