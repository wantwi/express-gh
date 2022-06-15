const express = require("express");
const router = express.Router();

const {getHotels,createHotel,getById} = require("../controllers/hotelController");

//  const { authorizeRoles,isAdminAuthenticatedUser } = require("../middleware/auth");


// router.route("/admin/login").post(loginUser);
// router.route("/admin/register").post(registerUser);

router.route("/hotels").get(getHotels);
router.route("/hotel").post(createHotel);

module.exports = router;