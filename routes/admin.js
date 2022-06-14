const express = require("express");
const router = express.Router();

const {registerUser,loginUser,adminTest, getUserProfile, uploadProfileImage} = require("../controllers/adminController");

 const { authorizeRoles,isAdminAuthenticatedUser } = require("../middleware/auth");


// router.route("/admin/login").post(loginUser);
// router.route("/admin/register").post(registerUser);

router.route("/admin").get(adminTest);
router.route("/admin/register").post(isAdminAuthenticatedUser,authorizeRoles('admin'),registerUser);
router.route("/admin/login").post(loginUser);


router.route("/admin/user/me").get(isAdminAuthenticatedUser,getUserProfile);
router.route("/admin/user/profileimage").post(isAdminAuthenticatedUser,uploadProfileImage);

module.exports = router;