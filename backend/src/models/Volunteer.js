import db from "../config/db.js";

const Volunteer = {
  findAll: async ({
    page = 1,
    limit = 5,
    filters = {},
    sortBy = "volunteerId",
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
      if (filters.birthDateFrom) {
        conditions.push("birthDate >= ?");
        values.push(filters.birthDateFrom);
      }

      if (filters.birthDateTo) {
        conditions.push("birthDate <= ?");
        values.push(filters.birthDateTo);
      }

      if (filters.insertionDateFrom) {
        conditions.push("insertionDate >= ?");
        values.push(filters.insertionDateFrom);
      }

      if (filters.insertionDateTo) {
        conditions.push("insertionDate <= ?");
        values.push(filters.insertionDateTo);
      }
      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(`
          (LOWER(firstName) LIKE ? OR 
          LOWER(lastName) LIKE ? OR 
          LOWER(email) LIKE ? OR 
          LOWER(phone) LIKE ? OR 
          LOWER(major) LIKE ? OR 
          LOWER(university) LIKE ? OR 
          LOWER(nationality) LIKE ? OR 
          LOWER(residentCountry) LIKE ?)
        `);
        // Add search term for each field
        values.push(...Array(8).fill(searchTerm));
      }
      if (conditions.length > 0)
        whereClause = "WHERE " + conditions.join(" AND ");

      const [rows] = await db.query(
        `
        SELECT volunteerId, firstName, lastName, birthDate, email, phone, gender, major, university  FROM volunteer 
        ${whereClause}
        ORDER BY ${sortBy} ${orderBy} 
        LIMIT ? OFFSET ?`,
        [...values, limit, offset]
      );
      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total FROM volunteer ${whereClause}`,
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
  findById: async ({ volunteerId }) => {
    const [rows] = await db.query(
      `SELECT v.*, u1.userName as userName, u2.userName as updatedByName
                 FROM volunteer v JOIN users u1 ON v.userId = u1.userId
                 LEFT JOIN users u2 ON v.updatedBy = u2.userId
                 WHERE volunteerId = ? LIMIT 0,1`,
      [volunteerId]
    );
    if (!rows[0]) throw new Error("User not found");
    return rows[0];
  },
  create: async ({ volunteer }) => {
    const [result] = await db.query(`INSERT INTO volunteer SET ?`, [volunteer]);
    if (!result) throw new Error("Volunteer not created!");
    return {
      volunteer,
    };
  },
  // search: async ({
  //   search = "",
  //   filters = {},
  //   page = 1,
  //   limit = 5,
  //   sortBy = "insertedAt",
  //   order = "DESC",
  // }) => {
  //   try {
  //     const offset = (page - 1) * limit;
  //     const conditions = [];
  //     const values = [];

  //     // Full-text search across multiple fields
  //     if (search && search.trim()) {
  //       const searchTerm = `%${search.toLowerCase()}%`;
  //       conditions.push(`
  //   (LOWER(firstName) LIKE ? OR
  //    LOWER(lastName) LIKE ? OR
  //    LOWER(email) LIKE ? OR
  //    LOWER(phone) LIKE ? OR
  //    LOWER(major) LIKE ? OR
  //    LOWER(university) LIKE ? OR
  //    LOWER(nationality) LIKE ? OR
  //    LOWER(residentCountry) LIKE ?)
  // `);
  //       // Add search term for each field
  //       values.push(...Array(8).fill(searchTerm));
  //     }

  //     // Exact match filters
  //     const filterableFields = [
  //       "birthDate",
  //       "major",
  //       "university",
  //       "userId",
  //       "gender",
  //       "nationality",
  //       "residentCountry",
  //       // "status", // If you have status field
  //     ];

  //     filterableFields.forEach((field) => {
  //       if (filters[field] !== undefined && filters[field] !== "") {
  //         if (Array.isArray(filters[field])) {
  //           // Handle multiple values (e.g., gender: ['male', 'female'])
  //           const placeholders = filters[field].map(() => "?").join(", ");
  //           conditions.push(`${field} IN (${placeholders})`);
  //           values.push(...filters[field]);
  //         } else {
  //           conditions.push(`${field} = ?`);
  //           values.push(filters[field]);
  //         }
  //       }
  //     });

  //     // Date range filters
  //     if (filters.birthDateFrom) {
  //       conditions.push("birthDate >= ?");
  //       values.push(filters.birthDateFrom);
  //     }

  //     if (filters.birthDateTo) {
  //       conditions.push("birthDate <= ?");
  //       values.push(filters.birthDateTo);
  //     }

  //     if (filters.insertionDateFrom) {
  //       conditions.push("insertionDate >= ?");
  //       values.push(filters.insertionDateFrom);
  //     }

  //     if (filters.insertionDateTo) {
  //       conditions.push("insertionDate <= ?");
  //       values.push(filters.insertionDateTo);
  //     }

  //     // Build WHERE clause
  //     const whereClause =
  //       conditions.length > 0 ? `WHERE ${conditions.join(" AND ")}` : "";

  //     // Count total for pagination
  //     const [[{ total }]] = await db.query(
  //       `SELECT COUNT(*) as total FROM volunteer ${whereClause}`,
  //       values
  //     );

  //     // Add pagination to values
  //     const queryValues = [...values, limit, offset];

  //     // Main search query
  //     const [rows] = await db.query(
  //       `SELECT * FROM volunteer
  //      ${whereClause}
  //      ORDER BY ${sortBy} ${order}
  //      LIMIT ? OFFSET ?`,
  //       queryValues
  //     );

  //     const totalPages = Math.ceil(total / limit);

  //     return {
  //       success: true,
  //       pagination: {
  //         page: parseInt(page),
  //         limit: parseInt(limit),
  //         total: parseInt(total),
  //         totalPages,
  //         hasNextPage: page < totalPages,
  //         hasPrevPage: page > 1,
  //       },
  //       filters: {
  //         search,
  //         ...filters,
  //       },
  //       data: rows,
  //     };
  //   } catch (error) {
  //     console.error("Search error:", error);
  //     throw error;
  //   }
  // },
  update: async ({ volunteer, volunteerId }) => {
    try {
      const {
        firstName,
        lastName,
        birthDate,
        major,
        university,
        userId,
        phone,
        email,
        gender,
        nationality,
        residentCountry,
      } = volunteer;

      const updates = [];
      const values = [];
      if (userId == undefined || !userId || !Number.isInteger(Number(userId)))
        throw new Error("Must provide current user");
      if (firstName !== undefined) {
        updates.push("firstName = ?");
        values.push(firstName);
      }
      if (lastName !== undefined) {
        updates.push("lastName = ?");
        values.push(lastName);
      }
      if (birthDate !== undefined) {
        updates.push("birthDate = ?");
        values.push(birthDate);
      }
      if (major !== undefined) {
        updates.push("major = ?");
        values.push(major);
      }
      if (university !== undefined) {
        updates.push("university = ?");
        values.push(university);
      }
      if (phone !== undefined) {
        updates.push("phone = ?");
        values.push(phone);
      }
      if (email !== undefined) {
        updates.push("email = ?");
        values.push(email);
      }
      if (gender !== undefined) {
        updates.push("gender = ?");
        values.push(gender);
      }
      if (nationality !== undefined) {
        updates.push("nationality = ?");
        values.push(nationality);
      }
      if (residentCountry !== undefined) {
        updates.push("residentCountry = ?");
        values.push(residentCountry);
      }
      updates.push("updatedBy = ?");
      values.push(userId);
      if (updates.length === 0)
        throw new Error("No valid fields provided for update");
      values.push(volunteerId);
      const [result] = await db.query(
        `
      UPDATE volunteer set ${updates.join(", ")}
      WHERE volunteerId = ?`,
        values
      );

      if (result.affectedRows === 0) throw new Error("volunteer not found");

      const updatedUser = await Volunteer.findById({ volunteerId });
      return updatedUser;
    } catch (error) {
      throw error;
    }
  },
};
export default Volunteer;
