const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/user");
const {
  InternalServerError,
} = require("../middlewares/customErrors/InternalServerError");
const { ConflictError } = require("../middlewares/customErrors/ConflictError");
const { NotFoundError } = require("../middlewares/customErrors/NotFoundError");
const {
  BadRequestError,
} = require("../middlewares/customErrors/BadRequestError");

const { JWT_SECRET } = require("../utils/config");

const postUser = (req, res, next) => {
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
        next(new BadRequestError("Data is Invalid"));
      }
      if (err.code === 11000) {
        return next(new ConflictError("This email already exists"));
      }
      return next(
        new InternalServerError("An Error Has Occured On The Server")
      );
    });
};

const getCurrentUser = (req, res, next) => {
  const userId = req.user;

  User.findById(userId)
    .orFail()
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Not Found"));
      }
      if (err.name === "CastError") {
        return next(new BadRequestError("Data is Invalid"));
      }
      return next(
        new InternalServerError("An Error Has Occured On The Server")
      );
    });
};

const login = async (req, res, next) => {
  const { email, password } = req.body;
  if (!email || !password) {
    return next(new BadRequestError("Email and password are required"));
  }
  try {
    const user = await User.findOne({ email }).select("+password");
    if (!user) {
      return next(new BadRequestError("Incorrect email or password"));
    }
    const matched = await bcrypt.compare(password, user.password);
    if (!matched) {
      return next(new BadRequestError("Incorrect email or password"));
    }
    const token = jwt.sign({ _id: user._id }, JWT_SECRET, { expiresIn: "7d" });
    return res.send({ token });
  } catch (err) {
    console.error(err);
    return next(new InternalServerError("An Error Has Occured On The Server"));
  }
};
const updateUser = (req, res, next) => {
  User.findByIdAndUpdate(
    req.user._id,
    { name: req.body.name, avatar: req.body.avatar },
    { new: true }
  )
    .then((user) => res.send(user))
    .catch((err) => {
      console.error(err);
      if (err.name === "DocumentNotFoundError") {
        return next(new NotFoundError("Not found"));
      }
      if (err.name === "ValidationError") {
        return next(new BadRequestError("Data is Invalid"));
      }
      return next(
        new InternalServerError("An error has occurred on the server")
      );
    });
};
module.exports = { postUser, getCurrentUser, login, updateUser };
