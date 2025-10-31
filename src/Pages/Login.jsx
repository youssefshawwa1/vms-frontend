// Components/Auth/Login.jsx
import { useState, useMemo } from "react";
// import { useNavigate } from "react-router-dom";
import { useAuth } from "../Contexts/AuthContext";
import { useValidateForm, validators } from "../Hooks/useValidateForm";
import fekra from "../assets/logo.png";
import {
  FormSubmitBtn,
  FormSectionGroup,
  FormSection,
} from "../Components/Global/Form";
const Login = () => {
  const validationRules = {
    username: validators.required("Username is required!"),
    password: validators.required("Password is required!"),
  };
  const initialData = {
    username: "",
    password: "",
  };
  const { formData, errors, handleChange, handleBlur, validateForm } =
    useValidateForm(initialData, validationRules);
  const structure = useMemo(
    () => [
      {
        label: "Username",
        error: errors.username,
        onChange: handleChange,
        value: formData.username,
        name: "username",
        holder: "",
        onBlur: handleBlur,
        show: true,
        classes: "grid grid-cols-1 sm:grid-cols-1",
      },
      {
        label: "Password",
        error: errors.password,
        onChange: handleChange,
        value: formData.password,
        name: "password",
        holder: "",
        onBlur: handleBlur,
        show: true,
        classes: "grid grid-cols-1 sm:grid-cols-1",
        type: "password",
      },
    ],
    [errors, formData, handleChange, handleBlur]
  );
  // const navigate = useNavigate();
  const [error, setError] = useState("");
  const { login, loading } = useAuth();
  const [success, setSuccess] = useState(false);
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (validateForm()) {
      try {
        console.log("Before login call");
        const result = await login(formData.username, formData.password);
        if (result.success) {
          setSuccess(true);
          // setTimeout(() => {
          //   navigate("/");
          // }, 2000);
        } else {
          setError(result.message);
        }
        console.log("After login call - success!");

        // console.log("Navigate called");
      } catch (err) {
        // console.error("Login error caught:", err);
        // console.error("Error message:", err.message);
        // console.error("Error stack:", err.stack);
        console.log(err);
        setError("Can't Reach Server!");
      }
    }
  };
  return (
    <div className="login-container flex  flex-col justify-center h-screen items-center">
      <div className="w-30">
        <img src={fekra} alt="fekra's logo" />
      </div>
      <div className=" p-5 items-center content-center h-100 rounded-xl shadow-2xl w-80 border-gray-200">
        <form onSubmit={handleSubmit}>
          <FormSectionGroup>
            <FormSection title="Welcome Back!" data={structure} />
          </FormSectionGroup>
          <FormSubmitBtn
            text={
              (loading && "Logging In") || (success && "Loged In!") || "Login"
            }
            error={error}
          />
        </form>
      </div>
    </div>
  );
};

export default Login;
