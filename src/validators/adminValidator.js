const { body } = require("express-validator");

const updateRoleValidator = [
  body("role")
    .isIn(["user", "admin"])
    .withMessage("Role must be either 'user' or 'admin'"),
];

module.exports = {
  updateRoleValidator,
};
