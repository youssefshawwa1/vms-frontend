// contexts/LoadingContext.js
import React, { createContext, useContext, useState, useMemo } from "react";

const VolunteerContext = createContext();

export const VolunteerProvider = ({ children }) => {
  const [volunteerDetails, setVolunteerDetails] = useState({});
  const [volunteerTeams, setVolunteerTeams] = useState({});
  const [volunteerTasks, setVolunteerTasks] = useState({});
  const [volunteerVolunteering, setVolunteerVolunteering] = useState({});
  const [volunteerHours, setVolunteerHours] = useState({});
  const [volunteerCertificates, setVolunteerCertificates] = useState({});
  const [teamsFilter, setTeamsFilter] = useState("current");
  const [tasksFilter, setTasksFilter] = useState("current");
  const [volunteeringFilter, setVolunteeringFilter] = useState("current");
  const [reFetchData, setReFetchData] = useState(false);
  const reFetch = () => {
    setVolunteerDetails({});
    setVolunteerTeams({});
    setVolunteerTasks({});
    setVolunteerVolunteering({});
    setVolunteerHours({});
    setVolunteerCertificates({});
    setVolunteeringFilter("current");
    setTasksFilter("current");
    setTeamsFilter("current");
    setReFetchData(!reFetchData);
  };
  const value = {
    volunteerDetails,
    volunteerTeams,
    volunteerTasks,
    volunteerVolunteering,
    volunteerHours,
    volunteerCertificates,
    volunteeringFilter,
    tasksFilter,
    teamsFilter,
    reFetch,
    reFetchData,
    setVolunteerDetails,
    setVolunteerTeams,
    setVolunteerTasks,
    setVolunteerVolunteering,
    setVolunteerHours,
    setVolunteerCertificates,
    setVolunteeringFilter,
    setTasksFilter,
    setTeamsFilter,
  };

  return (
    <VolunteerContext.Provider value={value}>
      {children}
    </VolunteerContext.Provider>
  );
};

export const useVolunteer = () => {
  const context = useContext(VolunteerContext);
  if (!context) {
    throw new Error("useVolunteer must be used within a VolunteerProvider");
  }
  return context;
};
