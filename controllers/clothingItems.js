const Item = require("../models/clothingItems");
const {
  BadRequestError,
  UnauthorizedError,
  ForbiddenError,
  NotFoundError,
  ConflictError,
} = require("../middlewares/customErrors");
const getItem = (req, res) => {
  Item.find({})
    .then((items) => res.send(items))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
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
      return Item.findByIdAndDelete(itemId)
        .then((deletedItem) => {
          if (!deletedItem) {
            throw new NotFoundError("Item Not Found");
          }

          res.send({ data: deletedItem });
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

const unlikeItem = (req, res) => {
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
        res.status(BAD_REQUEST_STATUS_CODE).send({ message: "Not Found" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An Error Has Occured On The Server" });
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
