const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
} = require("../utils/errors");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => {
      res.send(users);
    })
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
    });
};

const postUser = (req, res) => {
  const { name, avatar } = req.body;
  User.create({ name, avatar })
    .then((user) => res.status(201).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data Is Invalid" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
    });
};

const getUser = (req, res) => {
  const { userId } = req.params;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
    });
};

module.exports = { getUsers, postUser, getUser };
