const Joi = require("@hapi/joi");
const authController = require("../controllers/authController");

const routes = [
  {
    method: "POST",
    path: "/register",
    handler: authController.register,
    options: {
      validate: {
        payload: Joi.object({
          username: Joi.string().alphanum().min(3).max(30).required(),
          email: Joi.string().email().required(),
          password: Joi.string().min(8).required(),
        }),
      },
    },
  },
  {
    method: "POST",
    path: "/login",
    handler: authController.login,
    options: {
      validate: {
        payload: Joi.object({
          email: Joi.string().email().required(),
          password: Joi.string().required(),
        }),
      },
    },
  },
];

module.exports = routes;
