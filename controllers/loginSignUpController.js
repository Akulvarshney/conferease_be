const User = require("../db/models/userSchema");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const formatResponse = require("../middleware/responseFormat");
const ObjectId = mongoose.Types.ObjectId;

const checkEmail = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (user) {
      return formatResponse(res, true, null, "User Exisist", 200);
    } else {
      return formatResponse(res, false, null, "User does not exist", 404);
    }
  } catch (error) {
    console.error("Error searching email:", error);
    return formatResponse(res, false, null, "Internal error", 500);
  }
};

const emailRegistration = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });

    if (existingUser) {
      return formatResponse(res, false, null, "Email already exists", 400);
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = new User({ email, password: hashedPassword });

    await newUser.save();
    return formatResponse(
      res,
      true,
      email,
      "User registered successfully",
      400
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return formatResponse(res, false, null, "Internal Server Error", 500);
  }
};

const userRegistration = async (req, res) => {
  try {
    const { id } = req.params;
    const { name, affiliation, profilePic } = req.body;

    if (!ObjectId.isValid(id)) {
      return formatResponse(res, false, null, "Invalid ID format", 400);
    }

    const user = await User.findById(id);

    if (!user) {
      return formatResponse(res, false, null, "User Not Found", 404);
    }

    if (name) user.name = name;
    if (affiliation) user.affiliation = affiliation;
    if (profilePic) user.profilePic = profilePic;
    user.updatedAt = Date.now();

    await user.save();
    return formatResponse(res, true, user, "User details updated successfully");
  } catch (error) {
    console.error("Error updating user:", error);
    return formatResponse(res, false, null, "Internal Server Error", 500);
  }
};

module.exports = {
  checkEmail,
  emailRegistration,
  userRegistration,
};
