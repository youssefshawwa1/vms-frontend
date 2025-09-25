// contexts/LoadingContext.js
import React, { createContext, useContext, useState } from "react";

const TeamContext = createContext();

export const TeamProvider = ({ children }) => {
  const [teamDetails, setTeamDetails] = useState({});
  const [teamVolunteering, setTeamVolunteering] = useState({});
  const [teamTasks, setTeamTasks] = useState({});
  const [volunteeringFilter, setVolunteeringFilter] = useState("current");
  const [tasksFilter, setTasksFilter] = useState("current");
  const [reFetchData, setReFetchData] = useState(false);

  const reFetch = () => {
    setTeamDetails({});
    setTeamVolunteering({});
    setTeamTasks({});
    setVolunteeringFilter("current");
    setTasksFilter("current");
    setReFetchData(!reFetchData);
  };
  const value = {
    teamDetails,
    teamVolunteering,
    teamTasks,
    volunteeringFilter,
    tasksFilter,
    reFetch,
    reFetchData,
    setTeamDetails,
    setTeamVolunteering,
    setTeamTasks,
    setVolunteeringFilter,
    setTasksFilter,
  };

  return <TeamContext.Provider value={value}>{children}</TeamContext.Provider>;
};

export const useTeam = () => {
  const context = useContext(TeamContext);
  if (!context) {
    throw new Error("useLoading must be used within a VolunteerProvider");
  }
  return context;
};
