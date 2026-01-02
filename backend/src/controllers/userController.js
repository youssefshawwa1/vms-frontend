import bcrypt from "bcryptjs";
import User from "../models/User.js";
//everything related to the user conttroller is here.
const getAllUsers = async (req, res) => {
  //getting all users with filters.
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};
    const allowedFilters = ["birthDate", "status"];
    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });
    if (req.query.createdAtFrom) {
      filters.createdAtFrom = req.query.createdAtFrom;
    }
    if (req.query.createdAtTo) {
      filters.createdAtTo = req.query.createdAtTo;
    }
    if (req.query.search) {
      filters.search = req.query.search;
    }

    const rawSortBy = req.query.sortBy;
    const rawOrderBy = req.query.orderBy;
    const sortBy = allowedFilters.includes(rawSortBy) ? rawSortBy : "userId";
    const orderBy = rawOrderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const result = await User.findAll({
      page,
      limit,
      filters,
      sortBy,
      orderBy,
    });
    if (result.data)
      res.status(200).json({
        success: true,
        message: "Users retrived successfully",
        ...result,
      });
    else
      res.status(404).json({
        success: false,
        message: "No users found",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error.message,
    });
  }
};
const createUser = async (req, res) => {
  //creating a user, with some specific requirements.
  try {
    const { userName, userEmail, password, firstName, lastName, status, role } =
      req.body;

    if (!userName || !userEmail || !password || !firstName || !lastName) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const u = await User.findByUserName({ userName });
    if (u) {
      return res.status(400).json({
        success: false,
        message: "UserName exists",
      });
    }

    const existingEmail = await User.findByEmail({ userEmail });
    if (existingEmail) {
      return res.status(400).json({
        success: false,
        message: "An account with this email already exists",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);

    //calling method to create.
    const newUser = await User.create({
      user: {
        userName,
        userEmail,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        status,
        role,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created",
      data: newUser,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};
const updateUser = async (req, res) => {
  //updating the user, with some restriction, here can't update the password.
  try {
    const userId = req.params.userId;
    const updateData = req.body;
    const allowedUpdates = [
      "userName",
      "firstName",
      "lastName",
      "status",
      "userEmail",
    ];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedUser = await User.update({ userId: userId, user: updates });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    } else
      res.status(200).json({
        success: true,
        message: "user updated successfully",
        data: { user: updatedUser },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating user",
      error: error.message,
    });
  }
};
const updateProfile = async (req, res) => {
  //here can be updated the logged in profile, with making sure to get the password and check it.
  try {
    const userId = req.user.userId;
    const oldUserData = await User.findById({ userId, withPassword: true });
    const updateData = req.body;
    const allowedUpdates = [
      "userName",
      "firstName",
      "lastName",
      "status",
      "userEmail",
    ];
    const updates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    if (updateData.password == undefined || updateData.password == "") {
      return res.status(400).json({
        success: false,
        message: "Please make sure to submit your password!",
      });
    }

    const canUpdate = await bcrypt.compare(
      updateData.password,
      oldUserData.passwordHash
    );

    if (!canUpdate) {
      return res.status(400).json({
        success: false,
        message: "Incorrect Password!",
      });
    }
    if (updateData.newPassword !== undefined) {
      const hashedPassword = await bcrypt.hash(updateData.newPassword, 10);
      updates.passwordHash = hashedPassword;
    }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    const updatedUser = await User.update({ userId: userId, user: updates });
    if (!updatedUser) {
      return res.status(404).json({
        success: false,
        message: "Profile not found",
      });
    } else
      res.status(200).json({
        success: true,
        message: "Profile updated successfully",
        data: { user: updatedUser },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Profile",
      error: error.message,
    });
  }
};
const getUser = async (req, res) => {
  //here getting a user data, using id
  try {
    const userId = req.params.userId;
    if (!Number.isInteger(Number(userId)) || Number(userId) <= 999) {
      return res.status(400).json({
        success: false,
        message: "Invalid user id format. must be a positive integer.",
      });
    }
    const result = await User.findById({ userId });

    res.status(200).json({
      success: true,
      message: "User retrived successfully",
      data: { ...result },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error.message,
    });
  }
};

const deleteUser = async (req, res) => {
  //here deleting a user
  try {
    const userId = req.params.userId;
    if (!userId) {
      return res.status(400).json({
        success: false,
        message: "userId is required!",
      });
    }

    const result = await User.delete({ userId: userId });

    res.status(201).json({
      success: true,
      message: "User Deleted",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
export const getProfile = async (req, res) => {
  //here getting the profile of the logged in user
  const userId = req.user.userId;

  try {
    // We join with other tables if you want to show stats like 'Total Tasks'
    const response = await User.findById({ userId });

    res.json({ success: true, data: response });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export {
  getAllUsers,
  createUser,
  updateUser,
  getUser,
  deleteUser,
  updateProfile,
};
