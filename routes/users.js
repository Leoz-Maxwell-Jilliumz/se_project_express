const router = require("express").Router();
const { getUsers, postUser, getUser } = require("../controllers/users");

router.get("/", getUsers);
router.get("/:userId", getUser);
router.post("/", postUser);

module.exports = router;
