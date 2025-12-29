import Volunteer from "../models/Volunteer.js";

const getAllVolunteers = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};
    const allowedFilters = [
      "birthDate",
      "major",
      "university",
      "userId",
      "gender",
      "nationality",
      "residentCountry",
    ];
    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });

    if (req.query.birthDateFrom) {
      filters.birthDateFrom = req.query.birthDateFrom;
    }

    if (req.query.birthDateTo) {
      filters.birthDateTo = req.query.birthDateTo;
    }

    if (req.query.insertionDateFrom) {
      filters.insertionDateFrom = req.query.insertionDateFrom;
    }

    if (req.query.insertionDateTo) {
      filters.insertionDateTo = req.query.insertionDateTo;
    }
    if (req.query.search) {
      filters.search = req.query.search;
    }

    const sortBy = req.query.sortBy || "volunteerId";
    const orderBy = req.query.orderBy || "ASC";
    const result = await Volunteer.findAll({
      page,
      limit,
      filters,
      sortBy,
      orderBy,
    });
    if (result) {
      console.log(result);
      res.status(200).json({
        success: true,
        message: "Volunteers retrived successfully",
        ...result,
      });
    } else {
      res.status(404).json({
        success: false,
        message: "No Volunteers found",
      });
    }
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Volunteers",
      error: error.message,
    });
  }
};
const getVolunteer = async (req, res) => {
  try {
    const volunteerId = req.params.id;
    if (!Number.isInteger(Number(volunteerId)) || Number(volunteerId) <= 999) {
      res.status(400).json({
        success: false,
        message: "Invalid volunteer id format. must be a positive integer.",
      });
    }
    const result = await Volunteer.findById({ volunteerId });

    res.status(200).json({
      success: true,
      message: "volunteer retrived successfully",
      data: { ...result },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching volunteer",
      error: error.message,
    });
  }
};
const createVolunteer = async (req, res) => {
  try {
    const {
      firstName,
      lastName,
      birthDate,
      major,
      university,
      userId,
      phone,
      email,
      gender,
      nationality,
      residentCountry,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !major ||
      !university ||
      !userId ||
      !phone ||
      !email ||
      !gender ||
      !nationality ||
      !residentCountry
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const newVolunteer = await Volunteer.create({
      volunteer: {
        firstName,
        lastName,
        birthDate,
        major,
        university,
        userId,
        phone,
        email,
        gender,
        nationality,
        residentCountry,
      },
    });

    res.status(201).json({
      success: true,
      message: "Volunteer created",
      data: newVolunteer,
    });
  } catch (error) {
    // console.log(error);
    res.status(500).json({
      success: false,
      message: "Error creating volunteer",
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
// const searchVolunteers = async (req, res) => {
//   try {
//     const {
//       q = "", // search term
//       page = 1,
//       limit = 5,
//       sortBy = "insertionDate",
//       order = "DESC",
//       ...filters // all other query params become filters
//     } = req.query;

//     const result = await Volunteer.search({
//       search: q,
//       filters,
//       page: parseInt(page),
//       limit: parseInt(limit),
//       sortBy,
//       order: order.toUpperCase(),
//     });

//     res.status(200).json({
//       success: true,
//       message: "Search volunteers",
//       data: result,
//     });
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error searching volunteers",
//       error: error.message,
//     });
//   }
// };

export {
  getAllVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  // searchVolunteers,
};
