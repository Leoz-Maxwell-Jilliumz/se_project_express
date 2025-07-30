const router = require("express").Router();
const { NOT_FOUND_ERROR } = require("../utils/errors");

const userRouter = require("./users");

const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);

router.use((req, res) => {
  return res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
});

module.exports = router;
