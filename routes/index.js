const router = require("express").Router();
const { NotFoundError } = require("../middlewares/customErrors/NotFoundError");

const { login, postUser } = require("../controllers/users");

const userRouter = require("./users");

const clothingRouter = require("./clothingItems");

router.use("/users", userRouter);
router.use("/items", clothingRouter);
router.post("/signup", postUser);
router.post("/signin", login);

router.use((req, res, next) => next(new NotFoundError("Not Found")));

module.exports = router;
