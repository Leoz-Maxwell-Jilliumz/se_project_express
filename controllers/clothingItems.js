const Item = require("../models/clothingItems");
const {
  BAD_REQUEST_STATUS_CODE,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
} = require("../utils/errors");

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

const createItem = (req, res) => {
  const { name, weather, imageUrl } = req.body;

  const owner = req.user._id;
  Item.create({ name, weather, imageUrl, owner })
    .then((item) => res.status(201).send({ data: item }))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data Is Invalid" });
      }
      return res
        .status(500)
        .send({ message: "An Error Has Occured On The Server" });
    });
};

const deleteItem = (req, res) => {
  const { itemId } = req.params;

  Item.findByIdAndDelete(itemId)
    .orFail()
    .then((item) => res.send({ data: item }))
    .catch((err) => {
      if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
      } else if (err.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data Is Invalid" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An Error Has Occured On The Server" });
      }
    });
};

const likeItem = (req, res) => {
  Item.findByIdAndUpdate(
    req.params.itemId,
    { $addToSet: { likes: req.user._id } },
    { new: true }
  )
    .orFail()
    .then((item) => res.send(item))
    .catch((err) => {
      console.error(err);
      if (err.name === "CastError") {
        res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
      } else if (err.name === "DocumentNotFoundError") {
        res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
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
        res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
    });
};
module.exports = {
  getItem,
  createItem,
  deleteItem,
  likeItem,
  unlikeItem,
};
