// contexts/LoadingContext.js
import React, { createContext, useContext, useState } from "react";

const VolunteeringContext = createContext();

export const VolunteeringProvider = ({ children }) => {
  const [volunteeringDetails, setVolunteeringDetails] = useState({});

  const [volunteeringTasks, setVolunteeringTasks] = useState({});
  const [tasksFilter, setTasksFilter] = useState("current");
  const [reFetchData, setReFetchData] = useState(false);

  const reFetch = () => {
    setVolunteeringDetails({});
    setVolunteeringTasks({});
    setTasksFilter("current");
    setReFetchData(!reFetchData);
  };
  const value = {
    volunteeringDetails,
    volunteeringTasks,
    tasksFilter,
    reFetch,
    reFetchData,
    setTasksFilter,
    setVolunteeringTasks,
    setVolunteeringDetails,
  };

  return (
    <VolunteeringContext.Provider value={value}>
      {children}
    </VolunteeringContext.Provider>
  );
};

export const useVolunteering = () => {
  const context = useContext(VolunteeringContext);
  if (!context) {
    throw new Error("useVolunteering must be used within a VolunteerProvider");
  }
  return context;
};
