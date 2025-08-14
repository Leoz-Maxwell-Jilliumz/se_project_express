const router = require("express").Router();
const { NOT_FOUND_ERROR } = require("../utils/errors");

const { login, postUser } = require("../controllers/users");

const userRouter = require("./users");

const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.post("/signup", postUser);
router.post("/signin", login);

router.use((req, res) =>
  res.status(NOT_FOUND_ERROR).send({ message: "Not Found" })
);

module.exports = router;
