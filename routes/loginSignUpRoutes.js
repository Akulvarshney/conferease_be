const express = require("express");
const {
  checkEmail,
  emailRegistration,
  userRegistration,
} = require("../controllers/loginSignUpController");

const router = express.Router();

router.post("/checkEmail", checkEmail);
router.post("/registerEmail", emailRegistration);
router.post("/userRegistration/:id", userRegistration);

module.exports = router;
