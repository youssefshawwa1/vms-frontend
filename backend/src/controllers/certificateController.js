import Certificate from "../models/Certificate.js";

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
    console.log(result);
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

export { getAllCertificates };
