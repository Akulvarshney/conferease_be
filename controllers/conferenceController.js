const Conference = require("../db/models/conferenceSchema");
const UserRole = require("../db/models/userRoleConferMap");
const mongoose = require("mongoose");
const formatResponse = require("../middleware/responseFormat");
const ObjectId = mongoose.Types.ObjectId;

const addNewConference = async (req, res) => {
  try {
    const { name, description, location, startDate, endDate, userId, roleId } =
      req.body;

    const missingFields = [];
    if (!name) missingFields.push("name");
    if (!startDate) missingFields.push("startDate");
    if (!endDate) missingFields.push("endDate");
    if (!userId) missingFields.push("userId");
    if (!roleId) missingFields.push("roleId");

    if (missingFields.length > 0) {
      formatResponse(
        res,
        false,
        null,
        `Missing required fields: ${missingFields.join(", ")}`,
        400
      );
    }

    const newConference = new Conference({
      name,
      description,
      location,
      startDate,
      endDate,
    });

    await newConference.save();

    const newUserRole = new UserRole({
      userId,
      conferenceId: newConference._id,
      roles: [roleId],
    });

    await newUserRole.save();

    const response = { newUserRole, newConference };

    return formatResponse(
      res,
      true,
      response,
      "Conference and Chair created successfully",
      201
    );
  } catch (error) {
    console.error("Error creating conference and user role:", error);
    return formatResponse(res, false, null, "Internal Server Error", 500);
  }
};

const allConferences = async (req, res) => {
  try {
    let { page, limit } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;

    const skip = (page - 1) * limit;

    const conferences = await Conference.find().skip(skip).limit(limit);
    const totalConferences = await Conference.countDocuments();

    if (conferences.length > 0) {
      const totalPages = Math.ceil(totalConferences / limit);
      return formatResponse(
        res,
        true,
        {
          conferences,
          totalPages,
          currentPage: page,
          totalConferences,
        },
        "Conferences List",
        200
      );
    } else {
      return formatResponse(res, false, null, "No Conference Found", 404);
    }
  } catch (error) {
    console.error("Error fetching conferences:", error);
    return formatResponse(res, false, null, "Internal Server Error", 500);
  }
};

module.exports = {
  addNewConference,
  allConferences,
};
