const Joi = require("@hapi/joi");
const userController = require("../controllers/productController");
const verifyToken = require("../controllers/jwtController");

const routes = [
  {
    method: "GET",
    path: "/product",
    options: {
      pre: [{ method: verifyToken }],
    },
    handler: userController.getProduct,
  },
  {
    method: "GET",
    path: "/product/{id}",
    handler: userController.getProductById,
  },
  {
    method: "POST",
    path: "/product",
    handler: userController.createProduct,
    options: {
      validate: {
        payload: Joi.object({
          name: Joi.string().min(3).max(100).required(),
          quantity: Joi.number().integer().min(0).required(),
          price: Joi.number().precision(2).min(0).required(),
        }),
      },
    },
  },
  {
    method: "PUT",
    path: "/product/{id}",
    handler: userController.updateProduct,
    options: {
      validate: {
        payload: Joi.object({
          oid: Joi.number().integer().required(),
          name: Joi.string().min(3).max(100).required(),
          quantity: Joi.number().integer().min(0).required(),
          price: Joi.number().precision(2).min(0).required(),
        }),
      },
    },
  },
  {
    method: "DELETE",
    path: "/product/{id}",
    handler: userController.deleteProduct,
  },
];

module.exports = routes;
