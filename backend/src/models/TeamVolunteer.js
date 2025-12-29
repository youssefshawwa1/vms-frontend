import db from "../config/db.js";

const TeamVolunteer = {
  findAll: async ({
    page = 1,
    limit = 5,
    filters = {},
    sortBy = "teamVolunteerId",
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
      if (filters.startDateFrom) {
        conditions.push("startDate >= ?");
        values.push(filters.startDateFrom);
      }
      if (filters.startDateTo) {
        conditions.push("startDate <= ?");
        values.push(filters.startDateTo);
      }
      if (filters.endDateFrom) {
        conditions.push("endDate >= ?");
        values.push(filters.endDateFrom);
      }
      if (filters.endDateTo) {
        conditions.push("endDate <= ?");
        values.push(filters.endDateTo);
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
        const searchTerm = `%${filters.search.toLowerCase()}$`;
        conditions.push(`
        LOWER(volunteerTitle) LIKE ? OR
        LOWER(description) LIKE ? 
          `);
        values.push(searchTerm, searchTerm);
      }
      if (conditions.length > 0)
        whereClause = "WHERE " + conditions.join(" AND ");
      const [rows] = await db.query(
        `
        SELECT * FROM teamvolunteer 
        ${whereClause}
        ORDER BY ${sortBy} ${orderBy} 
        LIMIT ? OFFSET ?`,
        [...values, limit, offset]
      );
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total FROM 	teamvolunteer ${whereClause}`,
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
  findById: async ({ teamVolunteerId }) => {
    const [rows] = await db.query(
      `SELECT tv.*, v.firstName, v.lastName, v.email, v.phone,
                 u.userName, u1.userName as updatedByName, te.teamName,
                 r.roleTitle, r.description as roleDescription
                 FROM teamvolunteer tv JOIN volunteer v
                 ON tv.volunteerId = v.volunteerId LEFT JOIN users u1
                 ON tv.updatedBy = u1.userId LEFT JOIN team te
                 ON tv.teamId = te.teamId LEFT JOIN role r
                 ON tv.roleId = r.roleId
                 LEFT JOIN users u ON tv.userId = u.userId
                 WHERE teamVolunteerId = ? LIMIT 0,1`,
      [teamVolunteerId]
    );
    if (!rows[0]) throw new Error("Volunteering not found");
    return rows[0];
  },

  create: async ({ teamVolunteer }) => {
    const [result] = await db.query(`INSERT INTO team SET ? `, [teamVolunteer]);
    if (!result) {
      throw new Error("Volunteering not created!");
    }
    return {
      teamVolunteer,
    };
  },
  update: async ({ teamVolunteer, teamVolunteerId }) => {
    try {
      //change active to status in db
      const {
        startDate,
        endDate,
        roleId,
        userId,
        description,
        volunteerTitle,
        active,
      } = teamVolunteer;

      const updates = [];
      const values = [];

      if (userId == undefined || !userId || !Number.isInteger(Number(userId)))
        throw new Error("Must provide current user");

      if (startDate !== undefined) {
        updates.push("startDate = ?");
        values.push(startDate);
      }
      if (endDate !== undefined) {
        updates.push("endDate = ?");
        values.push(endDate);
      }
      if (roleId !== undefined) {
        updates.push("roleId = ?");
        values.push(roleId);
      }
      if (description !== undefined) {
        updates.push("description = ?");
        values.push(description);
      }
      if (volunteerTitle !== undefined) {
        updates.push("volunteerTitle = ?");
        values.push(volunteerTitle);
      }
      if (active !== undefined) {
        updates.push("active = ?");
        values.push(active);
      }
      updates.push("updatedBy = ?");
      values.push(userId);
      if (updates.length === 0)
        throw new Error("No valid fields provided for update");

      values.push(teamVolunteerId);
      const [result] = await db.query(
        `
      UPDATE teamvolunteer set ${updates.join(", ")}
      WHERE teamVolunteerId = ?`,
        values
      );

      if (result.affectedRows === 0) throw new Error("Volunteering not found");

      const updatedTeam = await Team.findById({ teamId });
      return updatedTeam;
    } catch (error) {
      throw error;
    }
  },
};
export default TeamVolunteer;
