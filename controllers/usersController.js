const User = require("../db/models/userSchema");
const formatResponse = require("../middleware/responseFormat");

const searchUserByLetters = async (req, res) => {
  try {
    const { letters } = req.query;

    if (!letters) {
      return formatResponse(
        res,
        false,
        null,
        "Letters parameter is missing",
        400
      );
    }

    const regex = new RegExp(letters, "i");

    const users = await User.find({ email: { $regex: regex } }).select(
      "name email profilePic affiliation"
    );

    if (users.length > 0) {
      return formatResponse(res, true, users, "Users list", 200);
    } else {
      return formatResponse(
        res,
        false,
        null,
        "No users found with the specified letters",
        404
      );
    }
  } catch (error) {
    console.error("Error searching for users:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { searchUserByLetters };
