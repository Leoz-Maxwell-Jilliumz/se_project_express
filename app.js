const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const indexRouter = require("./routes/index");

const app = express();
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {
    console.log("connected to the database");
  })
  .catch(console.error);

app.use((req, res, next) => {
  req.user = {
    _id: "5d8b8592978f8bd833ca8133",
  };
  next();
});

const { PORT = 3001 } = process.env;
app.use(cors());

app.use(express.json());

app.use("/", indexRouter);

app.listen(PORT, () => {
  console.log(`server listening on ${PORT}`);
});
