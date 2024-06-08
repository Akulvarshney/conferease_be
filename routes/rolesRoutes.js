const express = require("express");
const { addNewRole, rolesOfUser } = require("../controllers/rolesController");

const router = express.Router();

router.post("/add_role", addNewRole);
router.get("/rolesOfUser", rolesOfUser);

module.exports = router;
