const Role = require("../db/models/role");
const bcrypt = require("bcrypt");
const mongoose = require("mongoose");
const formatResponse = require("../middleware/responseFormat");
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

module.exports = {
  addNewRole,
};
