import App from "./App";
import { AuthProvider } from "./Contexts/AuthContext";

const AppWrapper = () => {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
};
export default AppWrapper;
