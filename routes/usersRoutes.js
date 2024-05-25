const express = require("express");
const { searchUserByLetters } = require("../controllers/usersController");

const router = express.Router();

router.get("/searchUserByLetters", searchUserByLetters);

module.exports = router;
