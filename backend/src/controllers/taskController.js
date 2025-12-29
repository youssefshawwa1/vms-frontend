import Task from "../models/Task.js";
const getAllTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};
    const allowedFilters = [
      "completed",
      "teamId",
      "volunteerId",
      "teamVolunteerId",
    ];
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
    if (req.query.completionDateFrom) {
      filters.completionDateFrom = req.query.completionDateFrom;
    }
    if (req.query.completionDateTo) {
      filters.completionDateTo = req.query.completionDateTo;
    }
    const sortBy = req.query.sortBy || "taskId";
    const orderBy = req.query.orderBy || "ASC";

    const result = await Task.findAll({
      page,
      limit,
      filters,
      sortBy,
      orderBy,
    });
    if (result.data)
      res.status(200).json({
        success: true,
        message: "Task retrived successfully",
        ...result,
      });
    else
      res.status(404).json({
        success: false,
        message: "No tasks found",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching tasks",
      error: error.message,
    });
  }
};
const createTask = async (req, res) => {
  try {
    const teamVolunteerId = req.body.id || 0;
    const {
      taskName,
      taskDescription,
      startDate,
      endDate,
      volunteeringHours,
      userId,
      completed,
      completionDate,
    } = req.body;

    if (
      !taskName ||
      !taskDescription ||
      !userId ||
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
    const task = {
      taskName,
      taskDescription,
      userId,
      startDate,
      endDate,
      volunteeringHours,
      teamVolunteerId,
    };
    if (completed && completionDate) {
      task.completed = completed;
      task.completionDate = completionDate;
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
const updateTask = async (req, res) => {};
// const updateTask = async (req, res) => {
//   try {
//     const teamId = req.params.id;
//     const updateData = req.body;
//     console.log(updateData);
//     console.log(teamId);
//     const allowedUpdates = ["teamName", "description", "userId"];
//     const updates = {};
//     allowedUpdates.forEach((field) => {
//       if (updateData[field] !== undefined) {
//         updates[field] = updateData[field];
//       }
//     });

//     if (Object.keys(updates).length === 0) {
//       return res.status(400).json({
//         success: false,
//         message: "No valid fields provided for update",
//       });
//     }

//     const updatedTeam = await Team.update({ teamId: teamId, team: updates });
//     if (!updatedTeam) {
//       return res.status(404).json({
//         success: false,
//         message: "Team not found",
//       });
//     }
//     res.status(200).json({
//       success: true,
//       message: "Team updated successfully",
//       data: { team: updatedTeam },
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error updating team",
//       error: error.message,
//     });
//   }
// };

const getTask = async (req, res) => {
  try {
    const taskId = req.params.taskId || 0;
    const teamVolunteerId = req.params.teamVolunteerId || 0;
    if (!Number.isInteger(Number(taskId)) || Number(taskId) <= 999) {
      res.status(400).json({
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
const completeTask = async (req, res) => {};
const deleteTask = async (req, res) => {};
export {
  getAllTasks,
  createTask,
  updateTask,
  getTask,
  completeTask,
  deleteTask,
};
