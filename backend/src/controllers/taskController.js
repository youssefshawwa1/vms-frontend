import Task from "../models/task.js";
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
      "teamName",
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
const updateTask = async (req, res) => {
  try {
    const taskId = req.params.taskId;
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

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }
    updates.userId = req.user.userId;
    const updatedTask = await Task.update({
      taskId: taskId,
      task: updates,
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
    const updateData = req.body;
    const allowedUpdates = ["completionDate"];
    const userId = req.user.userId;
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
    updates.userId = userId;
    console.log();
    const updatedTask = await Task.update({
      taskId: taskId,
      task: updates,
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
const deleteTask = async (req, res) => {};
export { getAllTasks, updateTask, getTask, completeTask, deleteTask };
