import TeamVolunteer from "../models/TeamVolunteer.js";

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
    const sortBy = req.query.sortBy || "teamVolunteerId";
    const orderBy = req.query.orderBy || "ASC";
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
    }
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
const getTeamVolunteer = async (req, res) => {
  try {
    const teamVolunteerId = req.params.id;
    if (
      !Number.isInteger(Number(teamVolunteerId)) ||
      Number(teamVolunteerId) <= 999
    ) {
      res.status(400).json({
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
      userId,
      description,
      volunteerTitle,
      teamId,
      active,
    } = req.body;

    if (
      !volunteerId ||
      !startDate ||
      !roleId ||
      !userId ||
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

    const newVolunteer = await TeamVolunteer.create({
      volunteer: {
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

const updateVolunteer = async (req, res) => {
  // expecting:
  //         firstName:
  //     lastName:
  //     birthDate:
  //     major:
  //     university:
  //     phone:
  //     email:
  //     gender:
  //     nationality:
  //     residentCountry:
  //     userId:
  //    id (params.id)
  try {
    const volunteerId = req.params.id;
    const updateData = req.body;
    console.log(updateData);
    const allowedUpdates = [
      "firstName",
      "lastName",
      "birthDate",
      "major",
      "university",
      "userId",
      "phone",
      "email",
      "gender",
      "nationality",
      "residentCountry",
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

    const updatedVolunteer = await Volunteer.update({
      volunteerId: volunteerId,
      volunteer: updates,
    });
    if (!updatedVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Volunteer updated successfully",
      data: { volunteer: updatedVolunteer },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating volunteer",
      error: error.message,
    });
  }
};
// controller/volunteerController.js
const searchVolunteers = async (req, res) => {
  try {
    const {
      q = "", // search term
      page = 1,
      limit = 5,
      sortBy = "insertionDate",
      order = "DESC",
      ...filters // all other query params become filters
    } = req.query;

    const result = await Volunteer.search({
      search: q,
      filters,
      page: parseInt(page),
      limit: parseInt(limit),
      sortBy,
      order: order.toUpperCase(),
    });

    res.status(200).json({
      success: true,
      message: "Search volunteers",
      data: result,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error searching volunteers",
      error: error.message,
    });
  }
};

export {
  getAllTeamVolunteers,
  getTeamVolunteer,
  createTeamVolunteer,
  //   updateVolunteer,
  //   searchVolunteers,
};
