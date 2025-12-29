import bcrypt from "bcryptjs";
import User from "../models/User.js";

const getAllUsers = async (req, res) => {
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

    const sortBy = req.query.sortBy || "userId";
    const orderBy = req.query.orderBy || "ASC";

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
  try {
    const { userName, userEmail, password, firstName, lastName, status } =
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

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = await User.create({
      user: {
        userName,
        userEmail,
        passwordHash: hashedPassword,
        firstName,
        lastName,
        status,
      },
    });

    res.status(201).json({
      success: true,
      message: "User created",
      data: newUser,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating user",
      error: error.message,
    });
  }
};
const updateUser = async (req, res) => {
  try {
    const userId = req.params.id;
    const updateData = req.body;
    console.log(updateData);
    console.log(userId);
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
    }
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
const getUser = async (req, res) => {
  try {
    const userId = req.params.id;
    if (!Number.isInteger(Number(userId)) || Number(userId) <= 999) {
      res.status(400).json({
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
  try {
    const userId = req.params.id;
    console.log(userId);
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
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error deleting user",
      error: error.message,
    });
  }
};
export { getAllUsers, createUser, updateUser, getUser, deleteUser };
