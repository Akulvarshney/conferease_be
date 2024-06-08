const express = require("express");
const {
  addNewConference,
  allConferences,
  myConferences,
} = require("../controllers/conferenceController");

const router = express.Router();

router.post("/add_conference", addNewConference);
router.get("/allConferences", allConferences);
router.get("/myConferences", myConferences);

module.exports = router;
