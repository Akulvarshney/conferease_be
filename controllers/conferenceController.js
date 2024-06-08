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
    let { page, limit, search } = req.query;

    page = parseInt(page) || 1;
    limit = parseInt(limit) || 10;
    search = search ? search.trim() : "";

    const skip = (page - 1) * limit;

    let searchQuery = {};
    if (search) {
      searchQuery = {
        $or: [
          { name: { $regex: search, $options: "i" } },
          { location: { $regex: search, $options: "i" } },
        ],
      };
    }

    const conferences = await Conference.find(searchQuery)
      .skip(skip)
      .limit(limit);
    const totalConferences = await Conference.countDocuments(searchQuery);

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

const myConferences = async (req, res) => {
  const { userId, page, limit, search } = req.query;

  if (!userId) {
    return formatResponse(res, false, null, "User ID is required", 400);
  }

  let pageNumber = parseInt(page) || 1;
  let limitNumber = parseInt(limit) || 10;
  let searchString = search ? search.trim() : "";
  const skip = (pageNumber - 1) * limitNumber;

  try {
    let searchQuery = { userId };
    if (searchString) {
      searchQuery.$or = [
        { "conferenceId.name": { $regex: searchString, $options: "i" } },
        { "conferenceId.location": { $regex: searchString, $options: "i" } },
      ];
    }

    const userRoles = await UserRole.find(searchQuery)
      .populate("conferenceId")
      .skip(skip)
      .limit(limitNumber);

    if (userRoles.length === 0) {
      return formatResponse(
        res,
        false,
        null,
        "No conferences found for this user",
        404
      );
    }

    const conferences = userRoles.map((userRole) => userRole.conferenceId);
    const totalConferences = await UserRole.countDocuments(searchQuery);
    const totalPages = Math.ceil(totalConferences / limitNumber);

    return formatResponse(
      res,
      true,
      {
        conferences,
        totalPages,
        currentPage: pageNumber,
        totalConferences,
      },
      "Conferences retrieved successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching conferences:", error);
    return formatResponse(res, false, null, "Internal Server Error", 500);
  }
};

module.exports = {
  addNewConference,
  allConferences,
  myConferences,
};
