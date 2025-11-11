import { useState, useEffect } from "react";
import UserDetails from "./UserDetails";
import { useAuth } from "../../Contexts/AuthContext";
const Profile = () => {
  const { user } = useAuth();

  return <UserDetails userId={user.id} />;
};

export default Profile;
