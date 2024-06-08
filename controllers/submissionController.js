const Conference = require("../db/models/conferenceSchema");
const UserRole = require("../db/models/userRoleConferMap");
const Role = require("../db/models/role");
const Submission = require("../db/models/submissions");
const mongoose = require("mongoose");
const formatResponse = require("../middleware/responseFormat");
const ObjectId = mongoose.Types.ObjectId;

const addNewSubmission = async (req, res) => {
  try {
    const { userId, conferenceId, title, abstract, fileUrl } = req.body;

    const missingFields = [];
    if (!title) missingFields.push("title");
    if (!abstract) missingFields.push("abstract");
    if (!fileUrl) missingFields.push("fileUrl");
    if (missingFields.length > 0) {
      return formatResponse(
        res,
        false,
        null,
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    const role = await Role.findOne({ miniRoleName: "A" });
    if (!role) {
      return formatResponse(res, false, null, "Role not found", 404);
    }

    const newSubmission = new Submission({
      userId,
      conferenceId,
      title,
      abstract,
      fileUrl,
    });
    await newSubmission.save();

    const existingUserRole = await UserRole.findOne({ userId, conferenceId });

    const newUserRole = new UserRole({
      userId,
      conferenceId,
      roles: [role._id],
    });
    if (existingUserRole) {
      if (!existingUserRole.roles.includes(role._id)) {
        existingUserRole.roles.push(role._id);
        await existingUserRole.save();
      }
    } else {
      await newUserRole.save();
    }

    return formatResponse(
      res,
      true,
      {
        submission: newSubmission,
        userRole: newUserRole,
      },
      "Submission and user role created successfully",
      201
    );
  } catch (error) {
    console.error("Error creating submission and user role:", error);
    return res.status(500).json({ error: "Internal Server Error" });
  }
};

module.exports = { addNewSubmission };
