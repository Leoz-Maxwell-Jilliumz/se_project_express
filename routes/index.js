const router = require("express").Router();

const userRouter = require("./users");
const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.use((req, res, next) => {
  req.user = {
    _id: "6885549de4c5564ab654e15b",
  };
  next();
});

module.exports = router;
