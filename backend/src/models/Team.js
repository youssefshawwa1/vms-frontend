import db from "../config/db.js";

const Team = {
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

      if (Object.keys(filters).length > 0) {
        whereClause =
          "WHERE " +
          Object.keys(filters)
            .map((key) => `${key} = ?`)
            .join(" AND ");
        values.push(...Object.values(filters));
      }

      values.push(limit, offset);
      const [rows] = await db.query(
        `
        SELECT * FROM team 
        ${whereClause}
        ORDER BY ${sortBy} ${orderBy} 
        LIMIT ? OFFSET ?`,
        values
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
  findByName: async ({ teamName }) => {
    const [rows] = await db.query("SELECT * FROM team WHERE teamName = ?", [
      teamName,
    ]);
    // console.log(userName);
    return rows[0];
  },
  create: async ({ team }) => {
    const [result] = await db.query(`INSERT INTO team SET ? `, [team]);
    if (!result) {
      throw new Error("Team not created!");
    }
    return {
      team,
    };
  },
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
};
export default Team;
