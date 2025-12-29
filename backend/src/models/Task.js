const db = require("../config/database");

const Task = {
  create: async ({ task, teamVolunteerId }) => {
    const [result] = await db.query(`INSERT INTO tasks SET ?`, [
      {
        ...task,
        teamVolunteerId,
      },
    ]);
    const [tasks] = await db.query(`SELECT * FROM tasks WHERE taskId = ?`, [
      result.insertId,
    ]);
    return tasks[0];
  },

  // READ: Get all tasks for a specific volunteering (with pagination)
  findByVolunteeringId: async (
    volunteeringId,
    {
      page = 1,
      limit = 10,
      status,
      priority,
      dueBefore,
      dueAfter,
      sortBy = "created_at",
      order = "DESC",
    } = {}
  ) => {
    const offset = (page - 1) * limit;

    let query = `
      SELECT * FROM tasks 
      WHERE volunteering_id = ?
    `;

    const values = [volunteeringId];
    const conditions = [];

    // Add optional filters
    if (status) {
      conditions.push("status = ?");
      values.push(status);
    }

    if (priority) {
      conditions.push("priority = ?");
      values.push(priority);
    }

    if (dueBefore) {
      conditions.push("due_date <= ?");
      values.push(dueBefore);
    }

    if (dueAfter) {
      conditions.push("due_date >= ?");
      values.push(dueAfter);
    }

    // Add conditions to query
    if (conditions.length > 0) {
      query += " AND " + conditions.join(" AND ");
    }

    // Get total count first
    const countQuery = `SELECT COUNT(*) as total FROM (${query}) as count_query`;
    const [[{ total }]] = await db.query(countQuery, values);

    // Add sorting and pagination
    query += ` ORDER BY ${sortBy} ${order} LIMIT ? OFFSET ?`;
    values.push(limit, offset);

    const [tasks] = await db.query(query, values);

    return {
      data: tasks,
      pagination: {
        page: parseInt(page),
        limit: parseInt(limit),
        total: parseInt(total),
        totalPages: Math.ceil(total / limit),
        hasNextPage: page < Math.ceil(total / limit),
        hasPrevPage: page > 1,
      },
    };
  },

  // READ: Get single task by ID (scoped to volunteering)
  findById: async (taskId, volunteeringId) => {
    const [tasks] = await db.query(
      `SELECT * FROM tasks 
       WHERE task_id = ? AND volunteering_id = ?`,
      [taskId, volunteeringId]
    );
    return tasks[0];
  },

  // UPDATE: Update task (scoped to volunteering)
  update: async (taskId, volunteeringId, updates) => {
    // Only allow specific fields to be updated
    const allowedFields = [
      "title",
      "description",
      "status",
      "priority",
      "due_date",
      "estimated_hours",
      "actual_hours",
    ];
    const fieldsToUpdate = {};

    Object.keys(updates).forEach((key) => {
      if (allowedFields.includes(key)) {
        fieldsToUpdate[key] = updates[key];
      }
    });

    // If marking as completed, set completed_at automatically
    if (fieldsToUpdate.status === "completed" && !updates.completed_at) {
      fieldsToUpdate.completed_at = new Date();
    }

    if (Object.keys(fieldsToUpdate).length === 0) {
      throw new Error("No valid fields to update");
    }

    // Build SET clause
    const setClause = Object.keys(fieldsToUpdate)
      .map((field) => `${field} = ?`)
      .join(", ");

    const values = [...Object.values(fieldsToUpdate), taskId, volunteeringId];

    await db.query(
      `UPDATE tasks 
       SET ${setClause}, updated_at = CURRENT_TIMESTAMP 
       WHERE task_id = ? AND volunteering_id = ?`,
      values
    );

    // Return updated task
    return Task.findById(taskId, volunteeringId);
  },

  // DELETE: Remove task (scoped to volunteering)
  delete: async (taskId, volunteeringId) => {
    const [result] = await db.query(
      `DELETE FROM tasks 
       WHERE task_id = ? AND volunteering_id = ?`,
      [taskId, volunteeringId]
    );
    return result.affectedRows > 0;
  },
};

export default Task;
