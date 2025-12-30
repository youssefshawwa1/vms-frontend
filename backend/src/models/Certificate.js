import db from "../config/db.js";

const Certificate = {
  findAll: async ({
    page = 1,
    limit = 5,
    filters = {},
    sortBy = "issueDate",
    orderBy = "ASC",
  } = {}) => {
    try {
      const offset = (page - 1) * limit;
      let whereClause = "";
      const values = [];
      const conditions = [];

      const simpleFilters = {};
      Object.keys(filters).forEach((key) => {
        if (
          key.includes("From") ||
          key.includes("To") ||
          key.includes("Above") ||
          key.includes("Below") ||
          key == "search"
        ) {
          return;
        }
        simpleFilters[key] = filters[key];
      });

      if (Object.keys(simpleFilters).length > 0) {
        Object.keys(simpleFilters).forEach((key) => {
          conditions.push(`c.${key} = ?`);
          values.push(simpleFilters[key]);
        });
      }

      if (filters.issueDateFrom) {
        conditions.push("c.issueDate >= ?");
        values.push(filters.issueDateFrom);
      }
      if (filters.issueDateTo) {
        conditions.push("c.issueDate <= ?");
        values.push(filters.issueDateTo);
      }
      if (filters.volunteeringHoursAbove) {
        conditions.push("c.volunteeringHours >= ? ");
        values.push(filters.volunteeringHoursAbove);
      }
      if (filters.volunteeringHoursBelow) {
        conditions.push("c.volunteeringHours <= ? ");
        values.push(filters.volunteeringHoursBelow);
      }
      if (filters.totalHoursAtIssueAbove) {
        conditions.push("c.totalHoursAtIssue >= ? ");
        values.push(filters.totalHoursAtIssueAbove);
      }
      if (filters.totalHoursAtIssueBelow) {
        conditions.push("c.totalHoursAtIssue <= ? ");
        values.push(filters.totalHoursAtIssueBelow);
      }

      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(`
          ( LOWER(c.certificateTitle) LIKE ? OR 
          LOWER(v.firstName) LIKE ? OR 
          LOWER(v.lastName) LIKE ? OR 
          LOWER(c.certificateDescription) LIKE ? OR 
          LOWER(c.certificateKind) LIKE ? OR 
          LOWER(c.certificateType) LIKE ? OR 
          LOWER(c.customeMessage) LIKE ? OR 
          LOWER(v.email) LIKE ? )`);
        values.push(...Array(8).fill(searchTerm));
      }

      if (conditions.length > 0)
        whereClause = "WHERE " + conditions.join(" AND ");
      console.log(whereClause);
      const [rows] = await db.query(
        `
        SELECT c.*, v.firstName, v.lastName, v.email, v.phone, v.volunteerId
            FROM  volunteeringcertificate c
            JOIN volunteer v ON c.volunteerId = v.volunteerId
        ${whereClause}
        ORDER BY ? ? 
        LIMIT ? OFFSET ?`,
        [...values, "c." + sortBy, orderBy, limit, offset]
      );

      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total FROM volunteeringcertificate c ${whereClause}`,
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
  //   findById: async ({ userId }) => {
  //     const [rows] = await db.query(
  //       `SELECT userId, userName, status, firstName, lastName, createdAt, updatedAt, userEmail FROM users WHERE userId = ?`,
  //       [userId]
  //     );
  //     if (!rows[0]) throw new Error("User not found");
  //     return rows[0];
  //   },
  //   findByUserName: async ({ userName }) => {
  //     const [rows] = await db.query("SELECT * FROM users WHERE username = ?", [
  //       userName,
  //     ]);
  //     // console.log(userName);
  //     return rows[0];
  //   },

  create: async ({ certificate }) => {
    const [result] = await db.query(
      "INSERT INTO 	volunteeringcertificate SET ?",
      [certificate]
    );
    if (!result) {
      throw new Error("Certificate not created!");
    }
    return {
      certificate,
    };
  },
  //   update: async ({ user, userId }) => {
  //     try {
  //       const { userName, userEmail, firstName, lastName, status } = user;

  //       const updates = [];
  //       const values = [];
  //       if (userName !== undefined) {
  //         const existingUser = await User.findByUserName({ userName: userName });
  //         if (existingUser && existingUser.userId != userId) {
  //           throw new Error("User already exists");
  //         }
  //         updates.push("userName = ?");
  //         values.push(userName);
  //       }
  //       if (userEmail !== undefined) {
  //         updates.push("userEmail = ?");
  //         values.push(userEmail);
  //       }
  //       if (firstName !== undefined) {
  //         updates.push("firstName = ?");
  //         values.push(firstName);
  //       }
  //       if (lastName !== undefined) {
  //         updates.push("lastName = ?");
  //         values.push(lastName);
  //       }
  //       if (status !== undefined) {
  //         updates.push("status = ?");
  //         values.push(status);
  //       }

  //       if (updates.length === 0)
  //         throw new Error("No valid fields provided for update");

  //       values.push(userId);
  //       const [result] = await db.query(
  //         `
  //       UPDATE users set ${updates.join(", ")}
  //       WHERE userId = ?`,
  //         values
  //       );

  //       if (result.affectedRows === 0) throw new Error("User not found");

  //       const updatedUser = await User.findById({ userId });
  //       return updatedUser;
  //     } catch (error) {
  //       if (error.code === "ER_DUP_ENTRY") {
  //         throw new Error("Username already exists");
  //       }
  //       throw error;
  //     }
  //   },
  //   delete: async ({ userId }) => {
  //     const [result] = await db.query("DELETE FROM users WHERE userId=?", userId);
  //     if (!result) {
  //       throw new Error("User not Deleted!");
  //     }
  //     return {
  //       userId: userId,
  //     };
  //   },
  //   history: async ({ userId }) => {},
};
export default Certificate;
