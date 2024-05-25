const express = require("express");
const { addNewRole } = require("../controllers/rolesController");

const router = express.Router();

router.post("/add_role", addNewRole);

module.exports = router;
