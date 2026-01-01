import Certificate from "../models/Certificate.js";
import Volunteer from "../models/Volunteer.js";
import {
  generateCertificatePreview,
  generateCertificatePDF,
} from "../services/psfSerfice.js";
import { sendCertificateEmail } from "../services/emailService.js";
const getAllCertificates = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};
    const allowedFilters = [
      "volunteerId",
      "certificateKind",
      "certificateType",
      "volunteeringHours",
      "emailSentCount",
      "issueDate",
      "certificateNumber",
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
    if (req.query.volunteeringHoursFrom) {
      filters.volunteeringHoursFrom = req.query.volunteeringHoursFrom;
    }
    if (req.query.volunteeringHoursTo) {
      filters.volunteeringHoursTo = req.query.volunteeringHoursTo;
    }
    if (req.query.totalHoursAtIssueFrom) {
      filters.totalHoursAtIssueFrom = req.query.totalHoursAtIssueFrom;
    }
    if (req.query.totalHoursAtIssueTo) {
      filters.totalHoursAtIssueTo = req.query.totalHoursAtIssueTo;
    }
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
const updateCertificate = async (req, res) => {
  try {
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
    });
    const volunteerId = oldCertificate.volunteerId;
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
    const certificateId = req.params.certificateId;
    if (
      !Number.isInteger(Number(certificateId)) ||
      Number(certificateId) <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid certificate id format. must be a positive integer.",
      });
    }
    const result = await Certificate.findById({ certificateId });

    res.status(200).json({
      success: true,
      message: "Certificate retrived successfully",
      data: {
        ...result,
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

// const date = new Date(result.issueDate);
// const month = date.toLocaleString("en-US", { month: "long" });
// const year = date.getFullYear();
// const formattedDate = `${month} ${year}`;

// const namesPart = [
//   result.firstName,
//   result.lastName,
//   result.certificateType,
//   result.certificateNumber,
//   new Date().toLocaleDateString(),
// ];
// const fileName = namesPart.join("_").toLowerCase();
// const certificateImageBuffer = await generateCertificatePreview({
//   certificateId: result.certificateNumber,
//   volunteerName: `${result.firstName} ${result.lastName}`,
//   certificateType: result.certificateType,
//   issueDate: formattedDate,
//   certificateDescription: result.certificateDescription,
//   title: fileName,
// });
// const base64CertificateImage = certificateImageBuffer.toString("base64");

const getCertificatePreview = async (req, res) => {
  try {
    const certificateId = req.params.certificateId;
    if (
      !Number.isInteger(Number(certificateId)) ||
      Number(certificateId) <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid certificate id format. must be a positive integer.",
      });
    }
    const result = await Certificate.findById({ certificateId });

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
        image: {
          imageInfo: {
            fileName: fileName,
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
    const certificateId = req.params.certificateId;
    if (
      !Number.isInteger(Number(certificateId)) ||
      Number(certificateId) <= 0
    ) {
      res.status(400).json({
        success: false,
        message:
          "Invalid volunteer id or certificate id format. must be a positive integer.",
      });
    }
    const result = await Certificate.findById({ certificateId });

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
    const pdfBuffer = await generateCertificatePDF({
      certificateId: result.certificateNumber,
      volunteerName: `${result.firstName} ${result.lastName}`,
      certificateType: result.certificateType,
      issueDate: formattedDate,
      certificateDescription: result.certificateDescription,
      title: fileName,
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
      "Content-Disposition": `attachment; filename="${fileName}.pdf"`,
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
//   try
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
    const certificateId = req.params.certificateId;

    if (
      !Number.isInteger(Number(certificateId)) ||
      Number(certificateId) <= 0
    ) {
      res.status(400).json({
        success: false,
        message: "Invalid certificate id format. must be a positive integer.",
      });
    }
    const result = await Certificate.findById({ certificateId });

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
  getAllCertificates,
  updateCertificate,
  getCertificate,
  getCertificatePdf,
  sendCertificateByEmail,
  getCertificatePreview,
};
