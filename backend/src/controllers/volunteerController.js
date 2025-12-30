import Volunteer from "../models/Volunteer.js";
import TeamVolunteer from "../models/TeamVolunteer.js";
import Task from "../models/Task.js";
import Certificate from "../models/Certificate.js";
import { sendCertificateEmail } from "../services/emailService.js";
import {
  generateCertificatePreview,
  generateCertificatePDF,
} from "../services/psfSerfice.js";

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
    const volunteerId = req.params.volunteerId;
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
    const volunteerId = req.params.volunteerId;
    const updateData = req.body;
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

const getVolunteerVolunteering = async (req, res) => {
  try {
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
    filters.volunteerId = volunteerId;
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

const getVolunteerTasks = async (req, res) => {
  try {
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
    const sortBy = req.query.sortBy || "taskId";
    const orderBy = req.query.orderBy || "ASC";
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
    }
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
    const sortBy = req.query.sortBy || "issueDate";
    const orderBy = req.query.orderBy || "ASC";

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

const createCertificate = async (req, res) => {
  try {
    const {
      certificateTitle,
      certificateDescription,
      volunteeringHours,
      customMessage,
      certificateType,
      certificateKind,
      userId,
    } = req.body;
    const volunteerId = req.params.volunteerId;
    if (
      !certificateTitle ||
      !certificateDescription ||
      !customMessage ||
      !certificateType ||
      !certificateKind ||
      !userId ||
      (certificateKind == "withHours" &&
        (volunteeringHours === undefined || volunteeringHours == 0))
    ) {
      return res.status(400).json({
        success: false,
        message: "All fields are required",
      });
    }

    const certificate = {
      certificateTitle,
      certificateDescription,
      customMessage,
      certificateType,
      certificateKind,
      issuedBy: userId,
      volunteerId,
    };
    if (certificateKind == "withHours") {
      certificate.volunteeringHours = volunteeringHours;
      certificate.totalHoursAtIssue = (
        await Volunteer.readVolunteeringHours({ volunteerId })
      ).totalHours;
    }
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
const updateCertificate = async (req, res) => {
  try {
    // certificateTitle,
    //   certificateDescription,
    //   volunteeringHours,
    //   customMessage,
    //   certificateType,
    //   certificateKind,
    //   userId,
    const volunteerId = req.params.volunteerId;
    const certificateId = req.params.certificateId;
    const updateData = req.body;

    const allowedUpdates = [
      "certificateTitle",
      "certificateDescription",
      "volunteeringHours",
      "customMessage",
      "certificateType",
      "certificateKind",
      "userId",
    ];

    const updates = {};
    allowedUpdates.forEach((field) => {
      if (updateData[field] !== undefined) {
        updates[field] = updateData[field];
      }
    });

    //check if its with hours
    //then check if the new hours can be issued.

    // if(updateData.certificateKind == "withHours"){

    // }

    if (Object.keys(updates).length === 0) {
      return res.status(400).json({
        success: false,
        message: "No valid fields provided for update",
      });
    }

    //     if($this->certificateKind == "withHours"){
    //     if($this->volunteeringHours > ($currentHours + $oldCertificateHours) ){
    //         return false;
    //     }
    //     elseif($this->isOld()) {
    //         return false;
    //     }
    // }
    // console.log(certificateId, volunteerId, updateData);
    const oldCertificate = await Certificate.findById({
      certificateId,
      volunteerId,
    });

    const volunteeringHours = await Volunteer.readVolunteeringHours({
      volunteerId,
    });
    const currentHours =
      parseFloat(volunteeringHours.totalHours) -
      parseFloat(volunteeringHours.issuedHours);
    if (updateData.certificateKind == "withHours") {
      if (
        parseFloat(updateData.volunteeringHours) >
        parseFloat(currentHours) + parseFloat(oldCertificate.volunteeringHours)
      ) {
        console.log("Jlksdjflkj");
        return res.status(400).json({
          success: false,
          message: "Can't update this certificate!",
        });
      }
    }

    const updatedCertificate = await Certificate.update({
      volunteerId,
      certificateId,
      certificate: updates,
    });
    if (!updatedCertificate) {
      return res.status(404).json({
        success: false,
        message: "Certificate not found",
      });
    }
    res.status(200).json({
      success: true,
      message: "Certificate updated successfully",
      data: { certificate: updatedCertificate },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating volunteer",
      error: error.message,
    });
  }
};
const getCertificate = async (req, res) => {
  try {
    const volunteerId = req.params.volunteerId;
    const certificateId = req.params.certificateId;
    if (
      !Number.isInteger(Number(volunteerId)) ||
      Number(volunteerId) <= 999 ||
      !Number.isInteger(Number(certificateId)) ||
      Number(certificateId) <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid volunteer id or certificate id format. must be a positive integer.",
      });
    }
    const result = await Certificate.findById({ volunteerId, certificateId });

    const date = new Date(result.issueDate);
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const formattedDate = `${month} ${year}`;

    const namesPart = [
      result.firstName,
      result.lastName,
      result.certificateType,
      result.certificateNumber,
      new Date().toLocaleDateString(),
    ];
    const fileName = namesPart.join("_").toLowerCase();
    const certificateImageBuffer = await generateCertificatePreview({
      certificateId: result.certificateNumber,
      volunteerName: `${result.firstName} ${result.lastName}`,
      certificateType: result.certificateType,
      issueDate: formattedDate,
      certificateDescription: result.certificateDescription,
      title: fileName,
    });
    const base64CertificateImage = certificateImageBuffer.toString("base64");
    res.status(200).json({
      success: true,
      message: "Certificate retrived successfully",
      data: {
        ...result,
        image: {
          imageInfo: {
            imageType: "image/jpeg",
            format: "base64",
            width: '11.69"',
            height: '8.27"',
            size: certificateImageBuffer.length,
          },
          preview: base64CertificateImage,
        },
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Certificate",
      error: error.message,
    });
  }
};
const getCertificatePdf = async (req, res) => {
  try {
    const volunteerId = req.params.volunteerId;
    const certificateId = req.params.certificateId;
    if (
      !Number.isInteger(Number(volunteerId)) ||
      Number(volunteerId) <= 999 ||
      !Number.isInteger(Number(certificateId)) ||
      Number(certificateId) <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid volunteer id or certificate id format. must be a positive integer.",
      });
    }
    const result = await Certificate.findById({ volunteerId, certificateId });

    const date = new Date(result.issueDate);
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const formattedDate = `${month} ${year}`;

    const namesPart = [
      result.firstName,
      result.lastName,
      result.certificateType,
      result.certificateNumber,
      new Date().toLocaleDateString(),
    ];
    const fileName = namesPart.join("_").toLowerCase();
    console.log(fileName);
    const pdfBuffer = await generateCertificatePDF({
      certificateId: result.certificateNumber,
      volunteerName: `${result.firstName} ${result.lastName}`,
      certificateType: result.certificateType,
      issueDate: formattedDate,
      certificateDescription: result.certificateDescription,
      title: namesPart.join("_").toLowerCase(),
    });

    // res.set({
    //   "Content-Type": "application/pdf",
    //   "Content-Disposition": 'attachment; filename="certificate.pdf"', // 'attachment' forces download
    //   "Content-Length": pdfBuffer.length,
    // });
    // return res.status(200).send(pdfBuffer);
    res.set({
      "Content-Type": "application/pdf",
      // 'inline' tells the browser to show the PDF in the tab
      "Content-Disposition": `attachment; filename="${fileName}"`,
      "Content-Length": pdfBuffer.length,
    });

    res.status(200).send(pdfBuffer);
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Certificate",
      error: error.message,
    });
  }
};
//   try {
//     const volunteerId = req.params.volunteerId;
//     const certificateId = req.params.certificateId;
//     if (
//       !Number.isInteger(Number(volunteerId)) ||
//       Number(volunteerId) <= 999 ||
//       !Number.isInteger(Number(certificateId)) ||
//       Number(certificateId) <= 0
//     ) {
//       res.status(400).json({
//         success: false,
//         message:
//           "Invalid volunteer id or certificate id format. must be a positive integer.",
//       });
//     }
//     const result = await Certificate.findById({ volunteerId, certificateId });

//     const date = new Date(result.issueDate);
//     const month = date.toLocaleString("en-US", { month: "long" });
//     const year = date.getFullYear();
//     const formattedDate = `${month} ${year}`;

//     const namesPart = [
//       result.firstName,
//       result.lastName,
//       result.certificateType,
//       result.certificateNumber,
//       new Date().toLocaleDateString(),
//     ];
//     const fileName = namesPart.join("_").toLowerCase();
//     const imageBuffer = await generateCertificatePreview({
//       certificateId: result.certificateNumber,
//       volunteerName: `${result.firstName} ${result.lastName}`,
//       certificateType: result.certificateType,
//       issueDate: formattedDate,
//       certificateDescription: result.certificateDescription,
//       title: fileName,
//     });

//     res.set({
//       "Content-Type": "image/jpeg",
//       "Cache-Control": "public, max-age=3600", // Cache it for 1 hour to save CPU
//     });

//     res.send(imageBuffer);
//   } catch (error) {
//     res.status(500).json({
//       success: false,
//       message: "Error fetching Certificate",
//       error: error.message,
//     });
//   }
// };
const sendCertificateByEmail = async (req, res) => {
  try {
    const volunteerId = req.params.volunteerId;
    const certificateId = req.params.certificateId;
    console.log(volunteerId, certificateId);
    if (
      !Number.isInteger(Number(volunteerId)) ||
      Number(volunteerId) <= 999 ||
      !Number.isInteger(Number(certificateId)) ||
      Number(certificateId) <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid volunteer id or certificate id format. must be a positive integer.",
      });
    }
    const result = await Certificate.findById({ volunteerId, certificateId });

    const date = new Date(result.issueDate);
    const month = date.toLocaleString("en-US", { month: "long" });
    const year = date.getFullYear();
    const formattedDate = `${month} ${year}`;

    const namesPart = [
      result.firstName,
      result.lastName,
      result.certificateType,
      result.certificateNumber,
      new Date().toLocaleDateString(),
    ];
    const fileName = namesPart.join("_").toLowerCase();
    console.log(fileName);
    const pdfBuffer = await generateCertificatePDF({
      certificateId: result.certificateNumber,
      volunteerName: `${result.firstName} ${result.lastName}`,
      certificateType: result.certificateType,
      issueDate: formattedDate,
      certificateDescription: result.certificateDescription,
      title: namesPart.join("_").toLowerCase(),
    });
    await sendCertificateEmail({
      email: result.email,
      data: {
        name: `${result.firstName} ${result.lastName}`,
        certificateType: result.certificateType,
      },
      pdfBuffer,
      fileName,
    });
    const registerResult = Certificate.registerSendByEmail({
      volunteerId,
      certificateId,
    });
    res.status(200).json({
      success: true,
      message: `Certificate sent successfully to ${result.email}`,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error sending certificate by email",
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
  updateCertificate,
  getCertificate,
  getCertificatePdf,
  sendCertificateByEmail,
};
