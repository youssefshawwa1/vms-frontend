import Volunteer from "../models/Volunteer.js";
import Volunteering from "../models/TeamVolunteer.js";
import Team from "../models/Team.js";
import Task from "../models/Task.js";
import Certificate from "../models/Certificate.js";

export const getDashboardStats = async (req, res) => {
  try {
    const [
      totalVolunteers,
      totalVolunteering,
      activeVolunteering,
      totalTeams,
      totalTasks,
      activeTasks,
      totalIssuedCertificates,
      totalVolunteeringHours,
      totalIssuedVolunteeringHours,
    ] = await Promise.all([
      Volunteer.getTotalCount(),
      Volunteering.getTotalCount(),
      Volunteering.getActiveCount(),
      Team.getTotalCount(),
      Task.getTotalCount(),
      Task.getActiveCount(),
      Certificate.getTotalIssued(),
      Certificate.getTotalIssuedHours(),
    ]);

    res.status(200).json({
      success: true,
      data: {
        totalVolunteers,
        totalVolunteering,
        activeVolunteering,
        totalTeams,
        totalTasks,
        activeTasks,
        totalIssuedVolunteeringCertificates: totalIssuedCertificates,
        totalVolunteeringHours,
        totalIssuedVolunteeringHours,
      },
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({
      success: false,
      message: "Error fetching dashboard statistics",
      error: error.message,
    });
  }
};
