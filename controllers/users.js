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
  const { name, avatar, email } = req.body;
  bcrypt
    .hash(req.body.password, 10)
    .then((hash) => User.create({ name, avatar, email, password: hash }))
    .then((user) => {
      const userObj = user.toObject();
      delete userObj.password;
      res.status(201).send(userObj);
    })
    .catch((err) => {
      console.error(err);

      if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data Is Invalid" });
      } else if (err.code === 11000) {
        res
          .status(CONFLICT_ERROR)
          .send({ message: "This email already exists" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An Error Has Occured On The Server" });
      }
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
        res.status(NOT_FOUND_ERROR).send({ message: "Not Found" });
      } else if (err.name === "CastError") {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data is Invalid" });
      } else {
        res
          .status(INTERNAL_SERVER_ERROR)
          .send({ message: "An Error Has Occured On The Server" });
      }
    });
};

const login = (req, res) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .send({ message: "Email and password are required" });
  }
  User.findOne({ email })
    .select("+password")
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error("Incorrect email or password"));
      }
      return bcrypt.compare(password, user.password).then((matched) => {
        if (!matched) {
          return Promise.reject(new Error("Incorrect email or password"));
        }
        const token = jwt.sign({ _id: user._id }, JWT_SECRET, {
          expiresIn: "7d",
        });
        res.status(200).send({ token });
      });
    })
    .catch((err) => {
      console.error(err);
      if (err.message === "Incorrect email or password") {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Incorrect email or password" });
      }
      return res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An Error Has Occured On The Server" });
    });
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
        res.status(NOT_FOUND_ERROR).send({ message: "Not found" });
      } else if (err.name === "ValidationError") {
        res
          .status(BAD_REQUEST_STATUS_CODE)
          .send({ message: "Data Is Invalid" });
      }
      res
        .status(INTERNAL_SERVER_ERROR)
        .send({ message: "An error has occurred on the server" });
    });
};
module.exports = { getUsers, postUser, getCurrentUser, login, updateUser };
