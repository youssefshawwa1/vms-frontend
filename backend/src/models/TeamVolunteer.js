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
      const values = [];
      const conditions = [];

      // 1. Define which columns are allowed to be filtered directly
      // This protects your DB from malicious query keys
      const allowedFilters = [
        "roleId",
        "volunteerId",
        "teamId",
        "active",
        "teamVolunteerId",
        "startDate",
        "endDate",
        "teamName",
        "roleType",
        "email",
      ];

      // 2. Handle Simple Filters
      Object.keys(filters).forEach((key) => {
        if (allowedFilters.includes(key) && filters[key] !== undefined) {
          conditions.push(`${key} = ?`);
          values.push(filters[key]);
        }
      });

      // 3. Handle Range/Date Filters (No prefixes needed!)
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

      // 4. Handle Search
      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(`(
          LOWER(teamName) LIKE ? OR 
          LOWER(firstName) LIKE ? OR 
          LOWER(lastName) LIKE ? OR 
          LOWER(email) LIKE ? OR 
          LOWER(volunteerDescription) LIKE ?
        )`);
        values.push(...Array(5).fill(searchTerm));
      }

      const whereClause =
        conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

      // 5. The Main Query using a Derived Table (Subquery)
      const baseQuery = `
        SELECT * FROM (
          SELECT 
            tv.*, 
            r.roleTitle, 
            r.description AS roleDescription,
            v.firstName, 
            v.lastName, 
            CONCAT(v.firstName, ' ', v.lastName) AS volunteerName, 
            v.email, 
            v.phone, 
            t.teamName,
            tv.description AS volunteerDescription -- Alias this to avoid conflict with role.description
          FROM teamvolunteer tv
          JOIN role r ON r.roleId = tv.roleId
          JOIN volunteer v ON v.volunteerId = tv.volunteerId
          JOIN team t ON t.teamId = tv.teamId
        ) AS flattened_data
        ${whereClause}
        ORDER BY ${sortBy} ${orderBy}
        LIMIT ? OFFSET ?
      `;

      const [rows] = await db.query(baseQuery, [
        ...values,
        parseInt(limit),
        offset,
      ]);

      // 6. Count Query using the same logic
      const countQuery = `
        SELECT COUNT(*) as total FROM (
          SELECT tv.*, v.firstName, v.lastName, v.email, t.teamName, tv.description as volunteerDescription
          FROM teamvolunteer tv
          JOIN volunteer v ON v.volunteerId = tv.volunteerId
          JOIN team t ON t.teamId = tv.teamId
        ) AS flattened_data 
        ${whereClause}`;

      const [[{ total }]] = await db.query(countQuery, values);

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
      console.error(e);
      throw e;
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
    const [result] = await db.query(`INSERT INTO teamvolunteer SET ? `, [
      teamVolunteer,
    ]);
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

      const updatedTeam = await TeamVolunteer.findById({ teamVolunteerId });
      return updatedTeam;
    } catch (error) {
      throw error;
    }
  },
};
export default TeamVolunteer;
