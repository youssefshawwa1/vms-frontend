import db from "../config/db.js";

//task model is handling all tasks CRUD.
const Task = {
  //getting all tasks baased on filters, this will be used in teams, volunteering, and volunteer.
  findAll: async ({
    page = 1,
    limit = 5,
    filters = {},
    sortBy = "taskId",
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
        } else if (key.includes("completed"))
          simpleFilters["t." + key] = filters[key];
        else if (key.includes("teamId") || key.includes("teamName"))
          simpleFilters["te." + key] = filters[key];
        else if (key.includes("volunteerId"))
          simpleFilters["v." + key] = filters[key];
        else if (key.includes("teamVolunteerId"))
          simpleFilters["tv." + key] = filters[key];
      });
      if (Object.keys(simpleFilters).length > 0) {
        Object.keys(simpleFilters).forEach((key) => {
          conditions.push(`${key} = ?`);
          values.push(simpleFilters[key]);
        });
      }
      if (filters.createdAtFrom) {
        conditions.push("t.createdAt >= ?");
        values.push(filters.createdAtFrom);
      }

      if (filters.createdAtTo) {
        conditions.push("t.createdAt <= ?");
        values.push(filters.createdAtTo);
      }
      if (filters.endDateFrom) {
        conditions.push("t.endDate >= ?");
        values.push(filters.endDateFrom);
      }
      if (filters.endDateTo) {
        conditions.push("t.endDate <= ?");
        values.push(filters.endDateTo);
      }
      if (filters.completionDateFrom) {
        conditions.push("t.completionDate >= ?");
        values.push(filters.completionDateFrom);
      }
      if (filters.completionDateTo) {
        conditions.push("t.completionDate <= ?");
        values.push(filters.completionDateTo);
      }

      if (filters.search) {
        const searchTerm = `%${filters.search.toLowerCase()}%`;
        conditions.push(`
          ( LOWER(v.firstName) LIKE ? OR 
          LOWER(v.lastName) LIKE ? OR 
          LOWER(t.taskDescription) LIKE ? OR 
          LOWER(t.taskTitle) LIKE ? OR 
          LOWER(tv.volunteerTitle) LIKE ? OR 
          LOWER(te.teamName) LIKE ? )`);
        values.push(...Array(6).fill(searchTerm));
      }

      if (conditions.length > 0) {
        whereClause = "WHERE " + conditions.join(" AND ");
      }

      const [rows] = await db.query(
        `
      SELECT t.*, v.firstName, v.lastName, tv.volunteerTitle, te.teamName
            FROM tasks t
            JOIN teamvolunteer tv ON t.teamVolunteerId = tv.teamVolunteerId
            JOIN volunteer v ON tv.volunteerId = v.volunteerId
            JOIN team te ON te.teamId = tv.teamId
        ${whereClause}
        ORDER BY ${sortBy} ${orderBy} 
        LIMIT ? OFFSET ?`,
        [...values, limit, offset]
      );

      const [[{ total }]] = await db.query(
        `SELECT COUNT(*) as total 
            FROM tasks t
            JOIN teamvolunteer tv ON t.teamVolunteerId = tv.teamVolunteerId
            JOIN volunteer v ON tv.volunteerId = v.volunteerId
            JOIN team te ON te.teamId = tv.teamId
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
  //finding a specific task by id
  findById: async ({ taskId }) => {
    const [rows] = await db.query(
      `SELECT t.*, tv.volunteerTitle,
        v.volunteerId, v.firstName, v.lastName, v.email, v.phone, te.teamId, te.teamName,
        u.userName as createdByName, u.userId, u2.userName as updatedBy, u2.userId as updatedById,
        r.roleTitle,  r.roleId
        from tasks t 
        JOIN teamVolunteer tv ON tv.teamVolunteerId = t.teamVolunteerId 
        JOIN volunteer v ON v.volunteerId = tv.volunteerId 
        JOIN team te ON te.teamId = tv.teamId
        JOIN users u ON u.userId = t.userId 
        LEFT JOIN users u2 ON u2.userId = t.updatedBy 
        JOIN role r ON r.roleId = tv.roleId 
        WHERE taskId=? LIMIT 0,2`,
      [taskId]
    );
    if (!rows[0]) throw new Error("Task not found");
    return rows[0];
  },
  //creating a task
  create: async ({ task }) => {
    const [result] = await db.query(`INSERT INTO tasks SET ? `, [task]);
    if (!result) {
      throw new Error("Task not created!");
    }
    return {
      taskId: result.insertId,
      ...task,
    };
  },

  //dynamically update a task
  update: async ({ task, taskId }) => {
    try {
      const {
        taskTitle,
        taskDescription,
        startDate,
        endDate,
        volunteeringHours,
        completed,
        completionDate,
        userId,
      } = task;

      const updates = [];
      const values = [];

      if (userId == undefined || !userId || !Number.isInteger(Number(userId)))
        throw new Error("Must provide current user");

      if (taskTitle !== undefined) {
        updates.push("taskTitle = ?");
        values.push(taskTitle);
      }
      if (taskDescription !== undefined) {
        updates.push("taskDescription = ?");
        values.push(taskDescription);
      }

      if (startDate !== undefined) {
        updates.push("startDate = ?");
        values.push(startDate);
      }
      if (endDate !== undefined) {
        updates.push("endDate = ?");
        values.push(endDate);
      }

      if (volunteeringHours !== undefined) {
        updates.push("volunteeringHours = ?");
        values.push(volunteeringHours);
      }
      if (completed !== undefined) {
        updates.push("completed = ?");
        values.push(completed);
      }

      if (completionDate !== undefined || completionDate != "") {
        updates.push("completionDate = ?");
        values.push(completionDate);
      }

      updates.push("updatedBy = ?");
      values.push(userId);

      if (updates.length === 0)
        throw new Error("No valid fields provided for update");

      values.push(taskId);
      const [result] = await db.query(
        `
      UPDATE tasks set ${updates.join(", ")}
      WHERE taskId = ?`,
        values
      );

      if (result.affectedRows === 0) throw new Error("Task not found");

      const updatedTask = await Task.findById({ taskId });
      return updatedTask;
    } catch (error) {
      throw error;
    }
  },
  //get total tasks count, for the dashboard.
  getTotalCount: async () => {
    const [rows] = await db.execute("SELECT COUNT(*) as count FROM tasks");
    return rows[0].count;
  },
  //get currenly active tasks for the dashboard.
  getActiveCount: async () => {
    const [rows] = await db.execute(
      "SELECT COUNT(*) as count FROM tasks WHERE completed = 0"
    );
    return rows[0].count;
  },
  //delet a task if needed!
  delete: async ({ taskId }) => {
    //here deleting the certificate if needed!
    const [result] = await db.query(
      "DELETE FROM tasks WHERE taskId = ?",
      taskId
    );
    if (!result) {
      throw new Error("Task not Deleted!");
    }
    return {
      taskId: taskId,
    };
  },
  // update: async ({ task, taskId }) => {
  //   try {
  //     const { teamName, description, userId } = task;

  //     const updates = [];
  //     const values = [];

  //     if (userId == undefined || !userId || !Number.isInteger(Number(userId)))
  //       throw new Error("Must provide current user");

  //     if (teamName !== undefined) {
  //       const existingTeam = await Team.findByName({ teamName });
  //       if (existingTeam && existingTeam.teamId != teamId) {
  //         throw new Error("Team already exists");
  //       }
  //       updates.push("teamName = ?");
  //       values.push(teamName);
  //     }
  //     if (description !== undefined) {
  //       updates.push("description = ?");
  //       values.push(description);
  //     }
  //     updates.push("updatedBy = ?");
  //     values.push(userId);
  //     if (updates.length === 0)
  //       throw new Error("No valid fields provided for update");

  //     values.push(teamId);
  //     const [result] = await db.query(
  //       `
  //     UPDATE team set ${updates.join(", ")}
  //     WHERE teamId = ?`,
  //       values
  //     );

  //     if (result.affectedRows === 0) throw new Error("Team not found");

  //     const updatedTeam = await Team.findById({ teamId });
  //     return updatedTeam;
  //   } catch (error) {
  //     if (error.code === "ER_DUP_ENTRY") {
  //       throw new Error("Team Name already exists");
  //     }
  //     throw error;
  //   }
  // },
};
export default Task;
