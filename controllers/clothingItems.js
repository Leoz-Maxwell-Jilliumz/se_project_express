const Item = require("../models/clothingItems");
const {
  BadRequestError,
} = require("../middlewares/customErrors/BadRequestError");
const {
  InternalServerError,
} = require("../middlewares/customErrors/InternalServerError");
const { NotFoundError } = require("../middlewares/customErrors/NotFoundError");
const {
  ForbiddenError,
} = require("../middlewares/customErrors/ForbiddenError");

const getItem = (req, res, next) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      next(new InternalServerError("An Error Has Occured On The Server"));
    });
};

const createItem = (req, res, next) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item Not Found");
      }
      res.status(201).send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        next(new BadRequestError("Data Is Invalid"));
      } else {
        next(new InternalServerError("An Error Has Occured On The Server"));
      }
    });
};

const deleteItem = (req, res, next) => {
  const { itemId } = req.params;

  Item.findById(itemId)
    .orFail()
    .then((item) => {
      if (item.owner.toString() !== req.user._id.toString()) {
        throw new ForbiddenError(
          "You do not have permission to delete this item"
        );
      }
      return Item.findByIdAndDelete(itemId).then((deletedItem) => {
        if (!deletedItem) {
          throw new NotFoundError("Item Not Found");
        }

        res.send({ data: deletedItem });
      });
    })
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item Not Found"));
      } else if (err.name === "CastError") {
        next(new BadRequestError("Data Is Invalid"));
      } else {
        next(new InternalServerError("An Error Has Occured On The Server"));
      }
    });
};
const likeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => {
      if (!item) {
        throw new NotFoundError("Item Not Found");
      }
      res.send(item);
    })
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Data Is Invalid"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item Not Found"));
      } else {
        next(new InternalServerError("An Error Has Occured On The Server"));
      }
    });
};

const unlikeItem = (req, res, next) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $pull: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        next(new BadRequestError("Data Is Invalid"));
      } else if (err.name === "DocumentNotFoundError") {
        next(new NotFoundError("Item Not Found"));
      } else {
        next(new InternalServerError("An Error Has Occured On The Server"));
      }
    });
};
module.exports = {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
