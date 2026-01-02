import Role from "../models/role.js";

const getAllRoles = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit) || 5;
    const filters = {};
    const allowedFilters = ["roleId", "roleTitle", "description"];
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

    const rawSortBy = req.query.sortBy;
    const rawOrderBy = req.query.orderBy;
    const sortBy = allowedFilters.includes(rawSortBy) ? rawSortBy : "roleId";
    const orderBy = rawOrderBy?.toUpperCase() === "DESC" ? "DESC" : "ASC";
    const result = await Role.findAll({
      page,
      limit,
      filters,
      sortBy,
      orderBy,
    });
    if (result.data)
      res.status(200).json({
        success: true,
        message: "Roles retrived successfully",
        ...result,
      });
    else
      res.status(404).json({
        success: false,
        message: "No Roles found",
      });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching Roles",
      error: error.message,
    });
  }
};

export { getAllRoles };
