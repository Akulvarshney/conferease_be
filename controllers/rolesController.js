const Role = require("../db/models/role");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const formatResponse = require("../middleware/responseFormat");
const userRoleConferMap = require("../db/models/userRoleConferMap");
const ObjectId = mongoose.Types.ObjectId;

const addNewRole = async (req, res) => {
  try {
    const { roleName, miniRoleName } = req.body;

    const existingRole = await Role.findOne({ miniRoleName });

    if (existingRole) {
      return formatResponse(
        res,
        false,
        null,
        "Mini Role Name already exsist",
        404
      );
    }

    const newRole = new Role({ roleName, miniRoleName });

    await newRole.save();

    return formatResponse(res, true, newRole, "Role Added", 201);
  } catch (error) {
    console.error("Error adding role:", error);
    return formatResponse(res, false, null, "Internal Server Error", 500);
  }
};

const rolesOfUser = async (req, res) => {
  try {
    const { conferenceId, userId } = req.query;

    if (!conferenceId || !userId) {
      return formatResponse(
        res,
        false,
        null,
        "Conference ID and User ID are required",
        400
      );
    }

    const userRoles = await userRoleConferMap
      .find({
        conferenceId,
        userId,
      })
      .populate("roles");

    formatResponse(
      res,
      true,
      userRoles,
      "User roles fetched successfully",
      200
    );
  } catch (error) {
    console.error("Error fetching user roles:", error);
    formatResponse(res, false, null, "Internal Server Error", 500);
  }
};

module.exports = {
  addNewRole,
  rolesOfUser,
};
