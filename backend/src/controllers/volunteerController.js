import Volunteer from "../models/volunteer.js";
import TeamVolunteer from "../models/teamVolunteer.js";
import Task from "../models/task.js";
import Certificate from "../models/certificate.js";
//All actions concerning the volunteer is in this file.

const getAllVolunteers = async (req, res) => {
  //Getting all volunteers,  with filters, and pages, and limit.
  //this will be used by many otther endpoints, they will give it the filters, and it will work normally.
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};
    //the allowed filters are here
    const allowedFilters = [
      "birthDate",
      "major",
      "university",
      "userId",
      "gender",
      "nationality",
      "residentCountry",
      "firstName",
      "lastName",
    ];
    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });

    //special kind of filters that need to be handled.
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

    //making sure that sortBy and orderBy values are not an injection.
    const rawSortBy = req.query.sortBy;
    const rawOrderBy = req.query.orderBy;
    const sortBy = allowedFilters.includes(rawSortBy)
      ? rawSortBy
      : "volunteerId";
    const orderBy = rawOrderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    //Calling the Volunteer.findAll() which get the volunteers, with the given filtters, page, sortBy and orderBy, and with allowedFilters.
    const result = await Volunteer.findAll({
      page,
      limit,
      filters,
      sortBy,
      orderBy,
      allowedFilters,
    });
    //if there is result
    if (result) {
      res.status(200).json({
        success: true,
        message: "Volunteers retrived successfully",
        ...result,
      });
    } else {
      //no error but no result also.
      res.status(404).json({
        success: false,
        message: "No Volunteers found",
      });
    }
  } catch (error) {
    //there is an error occured
    res.status(500).json({
      success: false,
      message: "Error fetching Volunteers",
      error: error.message,
    });
  }
};
const getVolunteer = async (req, res) => {
  //getting specific voluntteer by getting its id from the params (url)
  try {
    const volunteerId = req.params.volunteerId;
    //check if its valid id.
    if (!Number.isInteger(Number(volunteerId)) || Number(volunteerId) <= 999) {
      res.status(400).json({
        success: false,
        message: "Invalid volunteer id format. must be a positive integer.",
      });
    }
    //getting the volunteer
    const result = await Volunteer.findById({ volunteerId });
    //responding to the user the data.
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
    //getting the data from the request body.
    const {
      firstName,
      lastName,
      birthDate,
      major,
      university,
      phone,
      email,
      gender,
      nationality,
      residentCountry,
    } = req.body;

    //those fields are required in order to create.
    if (
      !firstName ||
      !lastName ||
      !birthDate ||
      !major ||
      !university ||
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
    //getting the current logged in user, to put it n history.
    const userId = req.user.userId;
    //creating the volunteer.
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
    res.status(500).json({
      success: false,
      message: "Error creating volunteer",
      error: error.message,
    });
  }
};

const updateVolunteer = async (req, res) => {
  //the update is dynamic, it will see if any of the allowedUpdates is therr, then it will update it.
  try {
    const volunteerId = req.params.volunteerId;
    const updateData = req.body;
    const allowedUpdates = [
      "firstName",
      "lastName",
      "birthDate",
      "major",
      "university",
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
    updates.userId = req.user.userId;
    //updating the volunteer
    const updatedVolunteer = await Volunteer.update({
      volunteerId: volunteerId,
      volunteer: updates,
    });
    //if didnt update the user. then the user not found (returned null or empty row)
    if (!updatedVolunteer) {
      return res.status(404).json({
        success: false,
        message: "Volunteer not found",
      });
    } else
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

const getVolunteerVolunteering = async (req, res) => {
  try {
    //getting the volunteering of a volunteer
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const volunteerId = req.params.volunteerId;
    const filters = {};
    const allowedFilters = ["active", "roleId", "teamId", "volunteerTitle"];
    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });
    //speical filters
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
    //adding the volunteerId as a filter, as we will be using the TeamVolunteer.
    filters.volunteerId = volunteerId;
    const rawSortBy = req.query.sortBy;
    const rawOrderBy = req.query.orderBy;
    const sortBy = allowedFilters.includes(rawSortBy)
      ? rawSortBy
      : "teamVolunteerId";
    const orderBy = rawOrderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    //finding the volunteering with the optoins
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

const getVolunteerTasks = async (req, res) => {
  try {
    //getting the voluntteer ttasks
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const volunteerId = req.params.volunteerId;
    const filters = {};
    const allowedFilters = ["completed", "teamId", "teamVolunteerId"];
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
    filters.volunteerId = volunteerId;

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

const getVolunteerCertificates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const volunteerId = req.params.volunteerId;
    const filters = {};
    const allowedFilters = [
      "volunteerId",
      "certificateKind",
      "certificateType",
      "volunteeringHours",
      "emailSentCount",
    ];

    allowedFilters.forEach((key) => {
      if (req.query[key]) {
        filters[key] = req.query[key];
      }
    });
    if (req.query.issueDateFrom) {
      filters.issueDateFrom = req.query.issueDateFrom;
    }
    if (req.query.issueDateTo) {
      filters.issueDateTo = req.query.issueDateTo;
    }
    if (req.query.search) {
      filters.search = req.query.search;
    }
    if (req.query.volunteeringHoursAbove) {
      filters.volunteeringHoursAbove = req.query.volunteeringHoursAbove;
    }
    if (req.query.volunteeringHoursBelow) {
      filters.volunteeringHoursBelow = req.query.volunteeringHoursBelow;
    }
    if (req.query.totalHoursAtIssueAbove) {
      filters.totalHoursAtIssueAbove = req.query.totalHoursAtIssueAbove;
    }
    if (req.query.totalHoursAtIssueBelow) {
      filters.totalHoursAtIssueBelow = req.query.totalHoursAtIssueBelow;
    }
    filters.volunteerId = volunteerId;

    const rawSortBy = req.query.sortBy;
    const rawOrderBy = req.query.orderBy;
    const sortBy = allowedFilters.includes(rawSortBy) ? rawSortBy : "issueDate";
    const orderBy = rawOrderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC";

    const result = await Certificate.findAll({
      page,
      limit,
      filters,
      sortBy,
      orderBy,
    });
    if (result.data)
      res.status(200).json({
        success: true,
        message: "Certificates retrived successfully",
        ...result,
      });
    else
      res.status(404).json({
        success: false,
        message: "No certificates found",
        some: result,
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching certificates",
      error: error.message,
    });
  }
};
function generateCertificateNumber() {
  const prefix = "FEKRA-V-";
  const year = new Date().getFullYear(); // e.g., 2026

  // Generate 2 random bytes and convert to hex (4 characters)
  const randomSuffix = crypto.randomBytes(2).toString("hex").toUpperCase();

  return `${prefix}${year}${randomSuffix}`;
}
const createCertificate = async (req, res) => {
  //creating a certificate for a specific volunteer
  try {
    const {
      certificateTitle,
      certificateDescription,
      volunteeringHours,
      customMessage,
      certificateType,
      certificateKind,
    } = req.body;
    const volunteerId = req.params.volunteerId;

    //required fields
    if (
      !certificateTitle ||
      !certificateDescription ||
      !customMessage ||
      !certificateType ||
      !certificateKind ||
      (certificateKind == "withHours" &&
        (volunteeringHours === undefined || volunteeringHours == 0))
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }
    const userId = req.user.userId;

    //generating a certificate number.
    const certtificateNumber = generateCertificateNumber();
    //creating a certificate object
    const certificate = {
      certtificateNumber,
      certificateTitle,
      certificateDescription,
      customMessage,
      certificateType,
      certificateKind,
      issuedBy: userId,
      volunteerId,
    };
    //if the certificatte with hours, get the volunteering hours from the request
    if (certificateKind == "withHours") {
      certificate.volunteeringHours = volunteeringHours;
      certificate.totalHoursAtIssue = (
        await Volunteer.readVolunteeringHours({ volunteerId })
      ).totalHours;
    }
    //check if the the volunteer can have this certificate. based on the hours
    const canIssue = await Volunteer.canIssueCertificate({
      volunteerId,
      certificate,
    });
    if (!canIssue)
      return res.status(400).json({
        success: false,
        message: "Can't issue this certificate!",
      });

    const newVolunteer = await Certificate.create({ certificate });

    res.status(201).json({
      success: true,
      message: "Certificate created",
      data: newVolunteer,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error creating certificate",
      error: error.message,
    });
  }
};

export {
  getAllVolunteers,
  getVolunteer,
  createVolunteer,
  updateVolunteer,
  getVolunteerVolunteering,
  getVolunteerTasks,
  getVolunteerCertificates,
  createCertificate,
};
