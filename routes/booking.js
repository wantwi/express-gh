const express = require("express");
const router = express.Router();

const {
    newBooking
  } = require("../controllers/bookingController");
  
  const { isAuthenticatedUser, authorizeRoles } = require("../middleware/auth");

//   router.use(isAuthenticatedUser);

  router.route("/booking").post(newBooking);

  module.exports = router;