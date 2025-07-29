const router = require("express").Router();
const {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");

router.get("/", getItem);
router.post("/", createItem);
router.put("/:itemId/likes", likeItem);
router.delete("/:itemId/likes", unlikeItem);
router.delete("/:itemId", deleteItem);

module.exports = router;
