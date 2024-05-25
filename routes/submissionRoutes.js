const express = require("express");
const { addNewSubmission } = require("../controllers/submissionController");

const router = express.Router();

router.post("/addNewSubmission", addNewSubmission);

module.exports = router;
