const router = require("express").Router();
const {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");

router.get("/", getItem);
router.post("/", auth, createItem);
router.put("/:itemId/likes", auth, likeItem);
router.delete("/:itemId/likes", auth, unlikeItem);
router.delete("/:itemId", auth, deleteItem);

module.exports = router;
