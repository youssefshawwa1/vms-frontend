import db from "../config/db.js";
//Handling Teams Crud operations.
const Team = {
  //getting all teams, based on filters
  findAll: async ({
    page = 1,
    limit = 5,
    filters = {},
    sortBy = "teamId",
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

      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(`
          ( LOWER(teamId) LIKE ? OR 
          LOWER(teamName) LIKE ? OR 
          LOWER(description) LIKE ? )`);

        values.push(searchTerm, searchTerm, searchTerm);
      }

      if (conditions.length > 0)
        whereClause = "WHERE " + conditions.join(" AND ");

      const [rows] = await db.query(
        `
        SELECT * FROM team 
        ${whereClause}
        ORDER BY ${sortBy} ${orderBy} 
        LIMIT ? OFFSET ?`,
        [...values, limit, offset]
      );
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total FROM 	team ${whereClause}`,
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
  //getting a specific team using teamId
  findById: async ({ teamId }) => {
    const [rows] = await db.query(
      `SELECT t.*, u1.userName as userName, u2.userName as updatedByName
                 FROM team t JOIN users u1 ON t.userId = u1.userId
                 LEFT JOIN users u2 ON t.updatedBy = u2.userId
                 WHERE teamId= ? LIMIT 0,1`,
      [teamId]
    );
    if (!rows[0]) throw new Error("Team not found");
    return rows[0];
  },
  //find a team by its name for checking if a team exists already.
  findByName: async ({ teamName }) => {
    const [rows] = await db.query("SELECT * FROM team WHERE teamName = ?", [
      teamName,
    ]);
    // console.log(userName);
    return rows[0];
  },
  //creating a team
  create: async ({ team }) => {
    const [result] = await db.query(`INSERT INTO team SET ? `, [team]);
    if (!result) {
      throw new Error("Team not created!");
    }
    return {
      team,
    };
  },
  //updating a team dynamically
  update: async ({ team, teamId }) => {
    try {
      const { teamName, description, userId } = team;

      const updates = [];
      const values = [];

      if (userId == undefined || !userId || !Number.isInteger(Number(userId)))
        throw new Error("Must provide current user");

      if (teamName !== undefined) {
        const existingTeam = await Team.findByName({ teamName });
        if (existingTeam && existingTeam.teamId != teamId) {
          throw new Error("Team already exists");
        }
        updates.push("teamName = ?");
        values.push(teamName);
      }
      if (description !== undefined) {
        updates.push("description = ?");
        values.push(description);
      }
      updates.push("updatedBy = ?");
      values.push(userId);
      if (updates.length === 0)
        throw new Error("No valid fields provided for update");

      values.push(teamId);
      const [result] = await db.query(
        `
      UPDATE team set ${updates.join(", ")}
      WHERE teamId = ?`,
        values
      );

      if (result.affectedRows === 0) throw new Error("Team not found");

      const updatedTeam = await Team.findById({ teamId });
      return updatedTeam;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Team Name already exists");
      }
      throw error;
    }
  },
  //get total teams for dashboard.
  getTotalCount: async () => {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM team");
    return rows[0].count;
  },
  //delete a team
  delete: async ({ teamId }) => {
    //here deleting the certificate if needed!
    const [result] = await db.query(
      "DELETE FROM team WHERE teamId = ?",
      teamId
    );
    if (!result) {
      throw new Error("Team not Deleted!");
    }
    return {
      teamId: teamId,
    };
  },
};
export default Team;
