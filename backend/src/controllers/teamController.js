import Team from "../models/Team.js";
const getAllTeams = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};

    const result = await Team.findAll({
      page: page,
      limit: limit,
      filters: filters,
    });
    if (result.totalItems == 0)
      res.status(404).json({
        success: false,
        message: "No teams found",
      });
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
    const { teamName, description, userId } = req.body;

    if (!teamName || !description || !userId) {
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
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating team",
      error: error.message,
    });
  }
};
const updateTeam = async (req, res) => {
  try {
    const teamId = req.params.id;
    const updateData = req.body;
    console.log(updateData);
    console.log(teamId);
    const allowedUpdates = ["teamName", "description", "userId"];
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

    const updatedTeam = await Team.update({ teamId: teamId, team: updates });
    if (!updatedTeam) {
      return res.status(404).json({
        success: false,
        message: "Team not found",
      });
    }
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
    const teamId = req.params.id;
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
export { getAllTeams, createTeam, updateTeam, getTeam };
