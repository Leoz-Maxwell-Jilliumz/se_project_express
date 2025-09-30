const router = require("express").Router();
const {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
} = require("../controllers/clothingItems");
const { auth } = require("../middlewares/auth");
const {
  validateItemCreation,
  validateItemIdParam,
} = require("../middlewares/validation");

router.get("/", getItem);
router.post("/", auth, validateItemCreation, createItem);
router.put("/:itemId/likes", auth, validateItemIdParam, likeItem);
router.delete("/:itemId/likes", auth, validateItemIdParam, unlikeItem);
router.delete("/:itemId", auth, validateItemIdParam, deleteItem);

module.exports = router;
