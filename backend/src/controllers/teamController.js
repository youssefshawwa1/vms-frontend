import Team from "../models/Team.js";
import TeamVolunteer from "../models/teamVolunteer.js";
import Task from "../models/task.js";
const getAllTeams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};
    const allowedFilters = ["teamId", "teamName", "description"];
    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });
    if (req.query.search) {
      filters.search = req.query.search;
    }
    const rawSortBy = req.query.sortBy;
    const rawOrderBy = req.query.orderBy;
    const sortBy = allowedFilters.includes(rawSortBy) ? rawSortBy : "teamId";
    const orderBy = rawOrderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const result = await Team.findAll({
      page: page,
      limit: limit,
      filters: filters,
      sortBy: sortBy,
      orderBy: orderBy,
    });
    if (result.totalItems == 0)
      res.status(404).json({
        success: false,
        message: "No teams found",
      });
    else
      res.status(200).json({
        success: true,
        message: "Teams retrived successfully",
        ...result,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching teams",
      error: error.message,
    });
  }
};
const createTeam = async (req, res) => {
  try {
    const { teamName, description } = req.body;

    if (!teamName || !description) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const t = await Team.findByName({ teamName });
    if (t) {
      return res.status(400).json({
        success: false,
        message: "Team Name exists",
      });
    }
    userId = req.user.userId;
    const newTeam = await Team.create({
      team: {
        teamName,
        description,
        userId,
      },
    });

    res.status(201).json({
      success: true,
      message: "Team created",
      data: newTeam,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating team",
      error: error.message,
    });
  }
};
const updateTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    const updateData = req.body;
    const allowedUpdates = ["teamName", "description"];
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
    const updatedTeam = await Team.update({ teamId: teamId, team: updates });
    if (!updatedTeam) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    } else
      res.status(200).json({
        success: true,
        message: "Team updated successfully",
        data: { team: updatedTeam },
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating team",
      error: error.message,
    });
  }
};
const getTeam = async (req, res) => {
  try {
    const teamId = req.params.teamId;
    if (!Number.isInteger(Number(teamId)) || Number(teamId) <= 999) {
      res.status(400).json({
        success: false,
        message: "Invalid Team id format. must be a positive integer.",
      });
    }
    const result = await Team.findById({ teamId });

    res.status(200).json({
      success: true,
      message: "Team retrived successfully",
      data: { ...result },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Team",
      error: error.message,
    });
  }
};
const getTeamVolunteering = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const teamId = req.params.teamId;
    const filters = {};
    const allowedFilters = [
      "active",
      "roleId",
      "volunteerId",
      "volunteerTitle",
    ];
    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });
    if (req.query.startDateFrom) {
      filters.startDateFrom = req.query.startDateFrom;
    }
    if (req.query.startDateto) {
      filters.startDateto = req.query.startDateto;
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
    filters.teamId = teamId;

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
    } else
      res.status(404).json({
        success: false,
        message: "No Volunteering found",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Volunteering",
      error: error.message,
    });
  }
};
const getTeamTasks = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const teamId = req.params.teamId;
    const filters = {};
    const allowedFilters = ["completed", "volunteerId", "teamVolunteerId"];
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
    filters.teamId = teamId;

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
export {
  getAllTeams,
  createTeam,
  updateTeam,
  getTeam,
  getTeamVolunteering,
  getTeamTasks,
};
