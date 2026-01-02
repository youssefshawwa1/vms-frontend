import UserDetails from "./UserDetails";
import { useAuth } from "../../Contexts/AuthContext";
const Profile = () => {
  const { user } = useAuth();

  return <UserDetails userId={user.id} />;
};

export default Profile;
