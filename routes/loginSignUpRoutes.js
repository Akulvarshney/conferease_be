const express = require("express");
const {
  checkEmail,
  emailRegistration,
  userRegistration,
  login,
} = require("../controllers/loginSignUpController");

const router = express.Router();

router.post("/checkEmail", checkEmail);
router.post("/registerEmail", emailRegistration);
router.post("/userRegistration/:id", userRegistration);
router.post("/login", login);

module.exports = router;
