const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  BAD_REQUEST_STATUS_CODE,
  INTERNAL_SERVER_ERROR,
  NOT_FOUND_ERROR,
  CONFLICT_ERROR,
} = require("../utils/errors");
const { JWT_SECRET } = require("../utils/config");

const getUsers = (req, res) => {
  User.find({})
    .then((users) => res.send(users))
    .catch((err) => {
      console.error(err);
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
    });
};

const postUser = (req, res) => {
  const { name, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      return res.status(201).send(userObj);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data Is Invalid" });
      }
      if (err.code === 11000) {
        return res
          .status(CONFLICT_ERROR)
          .send({ message: "This email already exists" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
    });
};

const getCurrentUser = (req, res) => {
  const userId = req.user;

  User.findById(userId)
    .orFail()
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
      }
      if (err.name === "CastError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data is Invalid" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
    });
};

const login = async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password are required" });
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Incorrect email or password" });
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return res
        .status(BAD_REQUEST_STATUS_CODE)
        .send({ message: "Incorrect email or password" });
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.status(200).send({ token });
  } catch (err) {
    console.error(err);
    return res
      .status(INTERNAL_SERVER_ERROR)
      .send({ message: "An Error Has Occured On The Server" });
  }
};
const updateUser = (req, res) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    { new: true }
  )
    .then((user) => res.status(200).send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return res.status(NOT_FOUND_ERROR).send({ message: "Not found" });
      }
      if (err.name === "ValidationError") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data Is Invalid" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
module.exports = { getUsers, postUser, getCurrentUser, login, updateUser };
