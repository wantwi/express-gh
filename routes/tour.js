const express = require("express");
const router = express.Router();

const {
    createTour
  } = require("../controllers/tourController");
  
  const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

  router.use(isAuthenticatedUser);

  router.route("/tour").post(authorizeRoles('admin', 'lead-guide'), createTour);

  module.exports = router;