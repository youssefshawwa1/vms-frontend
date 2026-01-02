import db from "../config/db.js";
//the roles didnt matter much, they are here because I used them.
const Role = {
  //justt getting the all roles like the other functions.
  findAll: async ({
    page = 1,
    limit = 5,
    filters = {},
    sortBy = "roleId",
    orderBy = "ASC",
  } = {}) => {
    try {
      const offset = (page - 1) * limit;
      let whereClause = "";
      const values = [];
      const conditions = [];

      const simpleFilters = {};
      Object.keys(filters).forEach((key) => {
        if (key.includes("From") || key.includes("To") || key == "search") {
          return;
        }
        simpleFilters[key] = filters[key];
      });

      if (Object.keys(simpleFilters).length > 0) {
        Object.keys(simpleFilters).forEach((key) => {
          conditions.push(`${key} = ?`);
          values.push(simpleFilters[key]);
        });
      }

      if (filters.createdAtFrom) {
        conditions.push("createdAt >= ?");
        values.push(filters.createdAtFrom);
      }

      if (filters.createdAtTo) {
        conditions.push("createdAt <= ?");
        values.push(filters.createdAtTo);
      }
      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(`
          ( LOWER(roleTitle) LIKE ? OR 
          LOWER(description) LIKE ?  )`);
        values.push(searchTerm, searchTerm);
      }
      if (conditions.length > 0)
        whereClause = "WHERE " + conditions.join(" AND ");
      const [rows] = await db.query(
        `
        SELECT * FROM role 
        ${whereClause}
        ORDER BY ${sortBy} ${orderBy} 
        LIMIT ? OFFSET ?`,
        [...values, limit, offset]
      );
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total FROM role ${whereClause}`,
        values
      );
      const totalPages = Math.ceil(total / limit);
      return {
        pagination: {
          page: parseInt(page),
          limit: parseInt(limit),
          total: parseInt(total),
          totalPages,
          hasNextPage: page < totalPages,
          hasPrevPage: page > 1,
        },
        filters,

        data: rows,
      };
    } catch (e) {
      return e;
    }
  },
};
export default Role;
