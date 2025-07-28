const { getUsers, postUser, getUser } = require("../controllers/users");
const router = require("express").Router();

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", postUser);

module.exports = router;
