const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const { errors } = require("celebrate");

const indexRouter = require("./routes/index");

const errorHandler = require("./middlewares/errorHandler");

const { requestLogger, errorLogger } = require("./middlewares/logger");
require("dotenv").config();

const app = express();
app.use(cors());
mongoose
  .connect("mongodb://127.0.0.1:27017/wtwr_db")
  .then(() => {})
  .catch(console.error);

app.use(requestLogger);

const { PORT = 3001 } = process.env;

app.get("/crash-test", () => {
  setTimeout(() => {
    throw new Error("Server will crash now");
  }, 0);
});
app.use(express.json());

app.use("/", indexRouter);

app.use(errors());

app.use(errorHandler);

app.listen(PORT, () => {});
app.use(errorLogger);
