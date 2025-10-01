const { Joi, celebrate } = require("celebrate");
const validator = require("validator");

const validateURL = (value, helpers) => {
  if (validator.isURL(value)) {
    return value;
  }
  return helpers.error("string.uri");
};

// 1. Clothing item creation validation
const validateItemCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).required().messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 30 characters",
      "any.required": "Name is required",
    }),
    imageUrl: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Image URL is required",
      "string.uri": "Image URL must be a valid URL",
    }),
    weather: Joi.string().valid("hot", "warm", "cold").required(),
  }),
});

// 2. User creation validation
const validateUserCreation = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30).messages({
      "string.min": "Name must be at least 2 characters",
      "string.max": "Name must be at most 30 characters",
      "string.empty": "Name cannot be empty",
    }),
    about: Joi.string().min(2).max(30).messages({
      "string.min": "About must be at least 2 characters",
      "string.max": "About must be at most 30 characters",
      "string.empty": "About cannot be empty",
    }),
    avatar: Joi.string().required().custom(validateURL).messages({
      "string.empty": "Avatar URL is required",
      "string.uri": "Avatar URL must be a valid URL",
    }),
    email: Joi.string().required().email().messages({
      "string.email": "Email must be a valid email",
      "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

// 3. Authentication validation
const validateAuth = celebrate({
  body: Joi.object().keys({
    email: Joi.string().required().email().messages({
      "string.email": "Email must be a valid email",
      "string.empty": "Email is required",
    }),
    password: Joi.string().required().messages({
      "string.empty": "Password is required",
    }),
  }),
});

// 4. ID validation for user and clothing item
const validateId = celebrate({
  params: Joi.object().keys({
    id: Joi.string().hex().length(24).required().messages({
      "string.length": "ID must be 24 characters long",
      "string.hex": "ID must be a valid hexadecimal",
    }),
  }),
});

// 5. Validate user ID from params
const validateUserIdParam = celebrate({
  params: Joi.object().keys({
    userId: Joi.string().hex().length(24).required().messages({
      "string.length": "User ID must be 24 characters long",
      "string.hex": "User ID must be a valid hexadecimal",
    }),
  }),
});

// 6. Validate item ID from params
const validateItemIdParam = celebrate({
  params: Joi.object().keys({
    itemId: Joi.string().hex().length(24).required().messages({
      "string.length": "Item ID must be 24 characters long",
      "string.hex": "Item ID must be a valid hexadecimal",
    }),
  }),
});

// 7. Example: Validate query parameters (e.g., for filtering)
const validateQuery = celebrate({
  query: Joi.object().keys({
    weather: Joi.string().valid("hot", "warm", "cold"),
    owner: Joi.string().hex().length(24),
  }),
});

// 8. Example: Validate headers (e.g., for authorization)
const validateHeaders = celebrate({
  headers: Joi.object()
    .keys({
      authorization: Joi.string().required(),
    })
    .unknown(true),
});

// User profile update validation
const validateUserUpdate = celebrate({
  body: Joi.object().keys({
    name: Joi.string().min(2).max(30),
    avatar: Joi.string().custom(validateURL),
  }),
});

module.exports = {
  validateItemCreation,
  validateUserCreation,
  validateAuth,
  validateId,
  validateURL,
  validateUserIdParam,
  validateItemIdParam,
  validateQuery,
  validateHeaders,
  validateUserUpdate,
};
