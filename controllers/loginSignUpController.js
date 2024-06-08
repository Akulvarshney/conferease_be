const User = require("../db/models/userSchema");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
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
      200
    );
  } catch (error) {
    console.error("Error registering user:", error);
    return formatResponse(res, false, null, "Internal Server Error", 500);
  }
};

const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    const existingUser = await User.findOne({ email });
    if (!existingUser) {
      return formatResponse(res, false, null, "Invalid email or password", 401);
    }

    const isPasswordValid = await bcrypt.compare(
      password,
      existingUser.password
    );
    if (!isPasswordValid) {
      return formatResponse(res, false, null, "Invalid email or password", 401);
    }

    const token = jwt.sign(
      { userId: existingUser._id },
      process.env.JWT_SECRET,
      {
        expiresIn: "1d",
      }
    );

    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 24 * 60 * 60 * 1000,
    });

    const userData = {
      _id: existingUser._id,
      name: existingUser.name,
      affiliation: existingUser.affiliation,
    };

    return res.status(200).json({
      success: true,
      data: userData,
      token: token,
      message: "Login successful",
    });
  } catch (error) {
    console.error("Error logging in user:", error);
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
  login,
};
