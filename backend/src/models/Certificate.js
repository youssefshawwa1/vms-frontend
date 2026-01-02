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
      if (filters.volunteeringHoursFrom) {
        conditions.push("c.volunteeringHours >= ? ");
        values.push(filters.volunteeringHoursFrom);
      }
      if (filters.volunteeringHoursTo) {
        conditions.push("c.volunteeringHours <= ? ");
        values.push(filters.volunteeringHoursTo);
      }
      if (filters.totalHoursAtIssueFrom) {
        conditions.push("c.totalHoursAtIssue >= ? ");
        values.push(filters.totalHoursAtIssueFrom);
      }
      if (filters.totalHoursAtIssueTo) {
        conditions.push("c.totalHoursAtIssue <= ? ");
        values.push(filters.totalHoursAtIssueTo);
      }

      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(`
          ( LOWER(c.certificateTitle) LIKE ? OR 
          LOWER(v.firstName) LIKE ? OR 
          LOWER(v.lastName) LIKE ? OR 
          LOWER(v.phone) LIKE ? OR 
          LOWER(c.certificateDescription) LIKE ? OR 
          LOWER(c.certificateKind) LIKE ? OR 
          LOWER(c.certificateType) LIKE ? OR 
          LOWER(c.customMessage) LIKE ? OR 
          LOWER(c.certificateNumber) LIKE ? OR 
          LOWER(v.email) LIKE ? )`);
        values.push(...Array(10).fill(searchTerm));
      }

      if (conditions.length > 0)
        whereClause = "WHERE " + conditions.join(" AND ");
      const [rows] = await db.query(
        `
        SELECT c.*, v.firstName, v.lastName, v.email, v.phone, v.volunteerId
            FROM  volunteeringcertificate c
            JOIN volunteer v ON c.volunteerId = v.volunteerId
        ${whereClause}
        ORDER BY c.${sortBy} ${orderBy} 
        LIMIT ? OFFSET ?`,
        [...values, limit, offset]
      );

      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total 
        FROM volunteeringcertificate c 
        JOIN volunteer v ON c.volunteerId = v.volunteerId  
   ${whereClause}`,
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
  findById: async ({ certificateId }) => {
    const [rows] = await db.query(
      `
      SELECT c.*, v.firstName, v.lastName, v.volunteerId, v.phone, v.email,
        u.userId, u.userName, u2.userId as updatedById, u2.userName as updatedBy 
        FROM volunteeringcertificate c 
        JOIN volunteer v ON c.volunteerId = v.volunteerId 
        JOIN users u ON u.userId = c.issuedBy 
        LEFT JOIN users u2 ON u2.userId = c.updatedBy
        WHERE c.certificateId= ?  LIMIT 0,2
        `,
      [certificateId]
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

      const [result] = await db.query(
        `
        UPDATE volunteeringcertificate set ${updates.join(", ")} 
        WHERE certificateId = ? `,
        values
      );

      if (result.affectedRows === 0) throw new Error("User not found");

      const updatedCertificate = await Certificate.findById({
        certificateId,
      });
      return updatedCertificate;
    } catch (error) {
      throw error;
    }
  },

  registerSendByEmail: async ({ certificateId }) => {
    const [rows] = await db.query(
      `
        UPDATE volunteeringcertificate
            SET emailSendCount = emailSendCount + 1,
            lastEmailSentAt = NOW(),
            firstEmailSentAt = COALESCE(firstEmailSentAt, NOW())
            WHERE certificateId = ? 
        `,
      [certificateId]
    );

    if (!rows.affectedRows) throw new Error("Certificate not found");
    return true;
  },
  getTotalIssued: async () => {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM volunteeringcertificate"
    );
    return rows[0].count;
  },
  getTotalIssuedHours: async () => {
    const [rows] = await db.execute(
      "SELECT SUM(volunteeringHours) FROM volunteeringcertificate WHERE certificateKind = 'withHours'"
    );
    return rows[0].count;
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
