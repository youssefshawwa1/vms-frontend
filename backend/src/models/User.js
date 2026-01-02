import db from "../config/db.js";

const User = {
  findAll: async ({
    page = 1,
    limit = 5,
    filters = {},
    sortBy = "userId",
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
          ( LOWER(userName) LIKE ? OR 
          LOWER(firstName) LIKE ? OR 
          LOWER(lastName) LIKE ? OR 
          LOWER(userEmail) LIKE ? )`);
        values.push(searchTerm, searchTerm, searchTerm, searchTerm);
      }
      if (conditions.length > 0)
        whereClause = "WHERE " + conditions.join(" AND ");
      const [rows] = await db.query(
        `
        SELECT * FROM users 
        ${whereClause}
        ORDER BY ${sortBy} ${orderBy} 
        LIMIT ? OFFSET ?`,
        [...values, limit, offset]
      );
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total FROM users ${whereClause}`,
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
  findById: async ({ userId }) => {
    try {
      const [rows] = await db.query(
        `SELECT userId, userName, status, firstName, lastName, createdAt, updatedAt, userEmail FROM users WHERE userId = ?`,
        [userId]
      );
      if (!rows[0]) throw new Error("User not found");
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  findByEmail: async ({ userEmail }) => {
    try {
      const [rows] = await db.execute(
        "SELECT * FROM users WHERE userEmail = ?",
        [userEmail]
      );
      if (!rows[0]) throw new Error("User not found");
      return rows[0];
    } catch (error) {
      throw error;
    }
  },
  findByUserName: async ({ userName }) => {
    const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
      userName,
    ]);
    // console.log(userName);
    return rows[0];
  },
  create: async ({ user }) => {
    const [result] = await db.query("INSERT INTO users SET ?", [user]);
    if (!result) {
      throw new Error("User not created!");
    }
    return {
      user,
    };
  },
  update: async ({ user, userId }) => {
    try {
      const { userName, userEmail, firstName, lastName, status } = user;

      const updates = [];
      const values = [];
      if (userName !== undefined) {
        const existingUser = await User.findByUserName({ userName: userName });
        if (existingUser && existingUser.userId != userId) {
          throw new Error("User already exists");
        }
        updates.push("userName = ?");
        values.push(userName);
      }
      if (userEmail !== undefined) {
        updates.push("userEmail = ?");
        values.push(userEmail);
      }
      if (firstName !== undefined) {
        updates.push("firstName = ?");
        values.push(firstName);
      }
      if (lastName !== undefined) {
        updates.push("lastName = ?");
        values.push(lastName);
      }
      if (status !== undefined) {
        updates.push("status = ?");
        values.push(status);
      }

      if (updates.length === 0)
        throw new Error("No valid fields provided for update");

      values.push(userId);
      const [result] = await db.query(
        `
      UPDATE users set ${updates.join(", ")}
      WHERE userId = ?`,
        values
      );

      if (result.affectedRows === 0) throw new Error("User not found");

      const updatedUser = await User.findById({ userId });
      return updatedUser;
    } catch (error) {
      if (error.code === "ER_DUP_ENTRY") {
        throw new Error("Username already exists");
      }
      throw error;
    }
  },
  delete: async ({ userId }) => {
    const [result] = await db.query("DELETE FROM users WHERE userId=?", userId);
    if (!result) {
      throw new Error("User not Deleted!");
    }
    return {
      userId: userId,
    };
  },
  history: async ({ userId }) => {},
};
export default User;
