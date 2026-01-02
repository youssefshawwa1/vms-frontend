import TeamVolunteer from "../models/TeamVolunteer.js";
import Task from "../models/Task.js";
const getAllTeamVolunteers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};

    const allowedFilters = [
      "active",
      "roleId",
      "teamId",
      "volunteerId",
      "volunteerTitle",
      "endDate",
      "startDate",
      "teamName",
      "teamVolunteerId",
      "roleType",
    ];
    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });

    if (req.query.startDateFrom) {
      filters.startDateFrom = req.query.startDateFrom;
    }
    if (req.query.startDateTo) {
      filters.startDateTo = req.query.startDateTo;
    }
    if (req.query.endDateFrom) {
      filters.endDateFrom = req.query.endDateFrom;
    }
    if (req.query.endDateTo) {
      filters.endDateTo = req.query.endDateTo;
    }
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
    const sortBy = allowedFilters.includes(rawSortBy)
      ? rawSortBy
      : "teamVolunteerId";
    const orderBy = rawOrderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const result = await TeamVolunteer.findAll({
      page,
      limit,
      filters,
      sortBy,
      orderBy,
    });
    if (result.data) {
      res.status(200).json({
        success: true,
        message: "Volunteering retrived successfully",
        ...result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No Volunteering found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Volunteering",
      error: error.message,
    });
  }
};
const getTeamVolunteer = async (req, res) => {
  try {
    const teamVolunteerId = req.params.teamVolunteerId;
    if (
      !Number.isInteger(Number(teamVolunteerId)) ||
      Number(teamVolunteerId) <= 999
    ) {
      return res.status(400).json({
        success: false,
        message: "Invalid volunteering id format. must be a positive integer.",
      });
    }
    const result = await TeamVolunteer.findById({ teamVolunteerId });

    res.status(200).json({
      success: true,
      message: "Volunteering retrived successfully",
      data: { ...result },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching volunteering",
      error: error.message,
    });
  }
};
const createTeamVolunteer = async (req, res) => {
  try {
    // (volunteerId , startDate , roleId, userId, description, volunteerTitle, teamId)
    //                     VALUES
    //                     (:volunteerId, :startDate, :roleId, :userId, :description, :volunteerTitle, :teamId)
    const {
      volunteerId,
      startDate,
      roleId,

      description,
      volunteerTitle,
      teamId,
      active,
    } = req.body;

    if (
      !volunteerId ||
      !startDate ||
      !roleId ||
      !description ||
      !volunteerTitle ||
      !teamId ||
      !active
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const userId = req.user.userId;
    const newVolunteer = await TeamVolunteer.create({
      teamVolunteer: {
        volunteerId,
        startDate,
        roleId,
        userId,
        description,
        volunteerTitle,
        teamId,
        active,
      },
    });

    res.status(201).json({
      success: true,
      message: "Volunteering created",
      data: newVolunteer,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating volunteering",
      error: error.message,
    });
  }
};

const updateTeamVolunteer = async (req, res) => {
  //   volunteerId,
  // startDate,
  // roleId,
  // userId,
  // description,
  // volunteerTitle,
  // teamId,
  // active,
  try {
    const teamVolunteerId = req.params.teamVolunteerId;
    const updateData = req.body;
    const allowedUpdates = [
      "startDate",
      "endDate",
      "roleId",
      "description",
      "volunteerTitle",
      "active",
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
    updates.userId = req.user.userId;
    const updatedTeamVolunteer = await TeamVolunteer.update({
      teamVolunteerId: teamVolunteerId,
      teamVolunteer: updates,
    });
    if (!updatedTeamVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteering not found",
      });
    } else
      res.status(200).json({
        success: true,
        message: "Volunteering updated successfully",
        data: { volunteering: updatedTeamVolunteer },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating Volunteering",
      error: error.message,
    });
  }
};
const getTeamVolunteerTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const teamVolunteerId = req.params.teamVolunteerId;
    const filters = {};
    const allowedFilters = ["completed", "teamId", "volunteerId"];
    const allowedSpecialFlters = [
      "createdAtFrom",
      "createdAtTo",
      "search",
      "startDateFrom",
      "startDateTo",
      "endDateFrom",
      "endDateTo",
      "completionDateFrom",
      "completionDateTo",
    ];
    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });
    allowedSpecialFlters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });
    // if (req.query.createdAtFrom) {
    //   filters.createdAtFrom = req.query.createdAtFrom;
    // }
    // if (req.query.createdAtTo) {
    //   filters.createdAtTo = req.query.createdAtTo;
    // }
    // if (req.query.search) {
    //   filters.search = req.query.search;
    // }
    // if (req.query.startDateFrom) {
    //   filters.startDateFrom = req.query.startDateFrom;
    // }
    // if (req.query.startDateTo) {
    //   filters.startDateTo = req.query.startDateTo;
    // }
    // if (req.query.endDateFrom) {
    //   filters.endDateFrom = req.query.endDateFrom;
    // }
    // if (req.query.endDateTo) {
    //   filters.endDateTo = req.query.endDateTo;
    // }
    // if (req.query.completionDateFrom) {
    //   filters.completionDateFrom = req.query.completionDateFrom;
    // }
    // if (req.query.completionDateTo) {
    //   filters.completionDateTo = req.query.completionDateTo;
    // }
    filters.teamVolunteerId = teamVolunteerId;

    const rawSortBy = req.query.sortBy;
    const rawOrderBy = req.query.orderBy;
    const sortBy = allowedFilters.includes(rawSortBy) ? rawSortBy : "taskId";
    const orderBy = rawOrderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const result = await Task.findAll({
      page,
      limit,
      filters,
      sortBy,
      orderBy,
    });
    if (result.data) {
      res.status(200).json({
        success: true,
        message: "Tasks retrived successfully",
        ...result,
      });
    } else
      res.status(404).json({
        success: false,
        message: "No Tasks found",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Tasks",
      error: error.message,
    });
  }
};
const endVolunteering = async (req, res) => {
  try {
    const teamVolunteerId = req.params.teamVolunteerId;
    const updateData = req.body;
    const allowedUpdates = ["endDate"];
    const updates = {};

    allowedUpdates.forEach((field) => {
      if (updateData[field] === undefined) {
        return res.status(400).json({
          success: false,
          message: "No valid fields provided for ending the volunteering",
        });
      }
      updates[field] = updateData[field];
    });

    updates["active"] = 0;
    updates.userId = req.user.userId;
    const updatedTeamVolunteer = await TeamVolunteer.update({
      teamVolunteerId: teamVolunteerId,
      teamVolunteer: updates,
    });
    if (!updatedTeamVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteering not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Volunteering put as ended successfully",
      data: {
        volunteering: {
          teamVolunteerId: updatedTeamVolunteer.teamVolunteerId,
          status: updatedTeamVolunteer.active,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error ending Volunteering",
      error: error.message,
    });
  }
};

const createTask = async (req, res) => {
  try {
    const teamVolunteerId = req.body.teamVolunteerId || 0;
    const {
      taskTitle,
      taskDescription,
      startDate,
      endDate,
      volunteeringHours,

      completed,
      completionDate,
    } = req.body;

    if (
      !taskTitle ||
      !taskDescription ||
      !startDate ||
      !endDate ||
      !volunteeringHours ||
      !teamVolunteerId
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const userId = req.user.userId;
    const task = {
      taskTitle,
      taskDescription,
      userId,
      startDate,
      endDate,
      volunteeringHours,
      teamVolunteerId,
    };
    if (completed !== undefined && completed) {
      if (completionDate !== undefined && completionDate) {
        task.completed = completed;
        task.completionDate = completionDate;
      } else
        return res.status(400).json({
          success: false,
          message: "All fields are required",
        });
    }
    const newTeam = await Task.create({
      task,
    });

    res.status(201).json({
      success: true,
      message: "Task created",
      data: newTeam,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating task",
      error: error.message,
    });
  }
};
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const teamVolunteerId = req.params.teamVolunteerId;
    const updateData = req.body;
    const allowedUpdates = [
      "taskTitle",
      "taskDescription",
      "startDate",
      "endDate",
      "volunteeringHours",
      "completed",
      "completionDate",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    if (
      Object.keys(updates).length === 0 ||
      updates.userId === undefined ||
      updates.userId === "" ||
      updates.userId <= 999
    ) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }
    updates.userId = req.user.userId;
    const updatedTask = await Task.update({
      taskId: taskId,
      task: updates,
      teamVolunteerId: teamVolunteerId,
    });
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    } else
      res.status(200).json({
        success: true,
        message: "Task updated successfully",
        data: { task: updatedTask },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating task",
      error: error.message,
    });
  }
};

const getTask = async (req, res) => {
  try {
    const taskId = req.params.taskId || 0;
    const teamVolunteerId = req.params.teamVolunteerId || 0;
    if (!Number.isInteger(Number(taskId)) || Number(taskId) <= 999) {
      return res.status(400).json({
        success: false,
        message: "Invalid task id format. must be a positive integer.",
      });
    }
    const result = await Task.findById({ taskId });

    res.status(200).json({
      success: true,
      message: "Task retrived successfully",
      data: { ...result },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Task",
      error: error.message,
    });
  }
};
const completeTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
    const teamVolunteerId = req.params.teamVolunteerId;
    const updateData = req.body;
    const allowedUpdates = ["completionDate"];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] === undefined) {
        return res.status(400).json({
          success: false,
          message: "No valid fields provided for complete this task",
        });
      }
      updates[field] = updateData[field];
    });
    updates["completed"] = 1;
    updates.userId = req.user.userId;
    const updatedTask = await Task.update({
      taskId: taskId,
      task: updates,
      teamVolunteerId: teamVolunteerId,
    });
    if (!updatedTask) {
      return res.status(404).json({
        success: false,
        message: "Task not found",
      });
    } else
      res.status(200).json({
        success: true,
        message: "Task put as completed successfully",
        data: { task: updatedTask },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error completing this task",
      error: error.message,
    });
  }
};

export {
  getAllTeamVolunteers,
  getTeamVolunteer,
  createTeamVolunteer,
  getTeamVolunteerTasks,
  updateTeamVolunteer,
  endVolunteering,
  createTask,
  updateTask,
  getTask,
  completeTask,
};
