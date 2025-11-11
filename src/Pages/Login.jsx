// Components/Auth/Login.jsx
import { useState, useMemo, useEffect } from "react";
import { Cancel } from "../Components/Global/Icons";
import { useAuth } from "../Contexts/AuthContext";
import { useValidateForm, validators } from "../Hooks/useValidateForm";
import fekra from "../assets/logo.png";
import {
  FormSubmitBtn,
  FormSectionGroup,
  FormSection,
} from "../Components/Global/Form";
const Login = () => {
  const [timeLeft, setTimeLeft] = useState(5);
  const [verifyCode, setVerifyCode] = useState("");
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
  const [verifyError, setVerifyError] = useState("");
  const [resend, setResend] = useState(false);
  const {
    verifyTheCode,
    login,
    loading,
    verificationRequired,
    resetVerification,
    resendCode,
  } = useAuth(); //must import verify-code
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (validateForm()) {
      try {
        const result = await login(formData.username, formData.password);
        if (result.success) {
          setError("");
        } else {
          setError(result.message);
        }
      } catch (err) {
        console.log(err);
        setError("Can't Reach Server!");
      }
    }
  };
  const handleSubmitVerify = async (e) => {
    e.preventDefault();
    if (verifyCode.length != 6 || isNaN(verifyCode)) {
      setVerifyError("Must be 6 digits!");
      return;
    }
    const response = await verifyTheCode(verifyCode);
    console.log(response);
    console.log("lksjdflkjdslkfj");
    if (!response.result) {
      setVerifyError(response.message);
    }
  };
  const handleResendCode = async () => {
    if (timeLeft == 0) {
      const response = await resendCode();
      if (response.result) {
        setError("");
        setVerifyError("");
        setResend((prev) => !prev);
        setTimeLeft(5);
      }
    }
  };
  useEffect(() => {
    if (!verificationRequired) return;

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, [verificationRequired, resend]);
  return (
    <div className="login-container flex  flex-col justify-center h-screen items-center">
      <div className="w-30">
        <img src={fekra} alt="fekra's logo" />
      </div>
      <div className=" p-5 items-center content-center h-100 rounded-xl shadow-2xl w-80 border-gray-200">
        {!verificationRequired && (
          <form onSubmit={handleSubmit}>
            <FormSectionGroup>
              <FormSection title="Welcome Back!" data={structure} />
            </FormSectionGroup>
            <FormSubmitBtn
              text={(loading && "Sending Code") || "Login"}
              error={error}
            />
          </form>
        )}
        {verificationRequired && (
          <div className="relative h-full">
            <button
              onClick={resetVerification}
              className="absolute top-0 right-0"
            >
              <Cancel />
            </button>
            <form onSubmit={handleSubmitVerify}>
              <FormSectionGroup>
                <FormSection
                  title="Code Sent to your Email!"
                  data={[
                    {
                      label: "Verification Code",
                      error: verifyError,
                      onChange: (e) => {
                        setVerifyCode(e.target.value);
                        setVerifyError("");
                      },
                      value: verifyCode,
                      name: "code",
                      onBlur: null,
                      show: true,
                      classes: "grid grid-cols-1 sm:grid-cols-1",
                    },
                  ]}
                />
              </FormSectionGroup>
              <p className="text-center text-gray-500 font-semibold text-sm flex justify-center mt-2">
                {timeLeft > 0 && (
                  <span>
                    Resend in: {Math.floor(timeLeft / 60)}:
                    {(timeLeft % 60).toString().padStart(2, "0")}
                  </span>
                )}
                {timeLeft == 0 && (
                  <span onClick={handleResendCode} className="cursor-pointer">
                    Resend
                  </span>
                  //add Resend Logic
                )}
              </p>
              <FormSubmitBtn text={(loading && "Loading") || "Verify"} />
              <p>{loading}</p>
            </form>
          </div>
        )}
      </div>
    </div>
  );
};

export default Login;
