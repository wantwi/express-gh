const express = require("express");
const router = express.Router();

const multer = require('multer')
const upload = multer({ dest: '../uploads/' })

const { addFacility, getAll, getAllStats, getById, searchFacility, uploadFile } = require("../controllers/facilityController");

//  const { authorizeRoles,isAdminAuthenticatedUser } = require("../middleware/auth");

router.route("/getall").get(getAll);
router.route("/getall/:facilityType").get(getAll);
router.route("/getById/:id").get(getById);
router.route("/stats").get(getAllStats);
router.route("/search").get(searchFacility);
router.route("/add/:facilityType").post(addFacility);
router.route("/files").post(upload.single('file'), uploadFile);

module.exports = router;