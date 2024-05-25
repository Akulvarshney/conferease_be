const express = require("express");
const {
  addNewConference,
  allConferences,
} = require("../controllers/conferenceController");

const router = express.Router();

router.post("/add_conference", addNewConference);
router.get("/allConferences", allConferences);

module.exports = router;
