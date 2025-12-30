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
  findById: async ({ certificateId, volunteerId }) => {
    const [rows] = await db.query(
      `
      SELECT c.*, v.firstName, v.lastName, v.volunteerId, v.phone, v.email,
        u.userId, u.userName, u2.userId as updatedById, u2.userName as updatedBy 
        FROM volunteeringcertificate c 
        JOIN volunteer v ON c.volunteerId = v.volunteerId 
        JOIN users u ON u.userId = c.issuedBy 
        LEFT JOIN users u2 ON u2.userId = c.updatedBy
        WHERE c.certificateId= ? AND v.volunteerId = ? LIMIT 0,2
        `,
      [certificateId, volunteerId]
    );
    if (!rows[0]) throw new Error("Certificate not found");
    return rows[0];
  },
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
  update: async ({ certificate, certificateId, volunteerId }) => {
    try {
      const {
        certificateTitle,
        certificateDescription,
        volunteeringHours,
        customMessage,
        certificateType,
        certificateKind,
        userId,
      } = certificate;

      const updates = [];
      const values = [];
      if (certificateTitle !== undefined) {
        updates.push("certificateTitle = ?");
        values.push(certificateTitle);
      }
      if (certificateDescription !== undefined) {
        updates.push("certificateDescription = ?");
        values.push(certificateDescription);
      }
      if (volunteeringHours !== undefined) {
        updates.push("volunteeringHours = ?");
        values.push(volunteeringHours);
      }
      if (customMessage !== undefined) {
        updates.push("customMessage = ?");
        values.push(customMessage);
      }
      if (certificateType !== undefined) {
        updates.push("certificateType = ?");
        values.push(certificateType);
      }
      if (certificateKind !== undefined) {
        updates.push("certificateKind = ?");
        values.push(certificateKind);
      }
      updates.push("updatedBy = ?");
      values.push(userId);
      if (updates.length === 0)
        throw new Error("No valid fields provided for update");
      values.push(certificateId);
      values.push(volunteerId);
      const [result] = await db.query(
        `
        UPDATE volunteeringcertificate set ${updates.join(", ")} 
        WHERE certificateId = ? AND volunteerId = ?`,
        values
      );

      if (result.affectedRows === 0) throw new Error("User not found");

      const updatedCertificate = await Certificate.findById({
        certificateId,
        volunteerId,
      });
      return updatedCertificate;
    } catch (error) {
      throw error;
    }
  },

  registerSendByEmail: async ({ certificateId, volunteerId }) => {
    const [rows] = await db.query(
      `
        UPDATE volunteeringcertificate
            SET emailSendCount = emailSendCount + 1,
            lastEmailSentAt = NOW(),
            firstEmailSentAt = COALESCE(firstEmailSentAt, NOW())
            WHERE certificateId = ? AND volunteerId = ?
        `,
      [certificateId, volunteerId]
    );

    if (!rows.affectedRows) throw new Error("Certificate not found");
    return true;
  },
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
