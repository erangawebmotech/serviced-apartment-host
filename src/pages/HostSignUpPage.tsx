import "../styles/login/loginStyles.scss";
import "../styles/commonStyles.scss";
import "../styles/contactNumberInputCustomStyle.scss";
import bgImage from "../assets/images/signUpImage.jpg";
import { requestOTPInRegister, signUpService } from "../service/auth";
import { useNavigate } from "react-router-dom";
import { customToastMsg, handleError } from "../common/commonFunctions";
import { useState } from "react";
import openImage from "../assets/images/line-md--watch.svg";
import blueLogo from "../assets/images/logo/Logo.png";
import svgTwo from "../assets/images/line-md--watch-off (1).svg";
import { Button, Divider, Input } from "antd";
import { SignUpValueEnum } from "../common/enums/signUpValueEnum";
import { ArrowLeft } from "react-feather";
import { validateInputs } from "../common/validation";
import PhoneInput, { CountryData } from "react-phone-input-2";
import "react-phone-input-2/lib/style.css";
import GoogleLoginComponent from "../components/common/auth/GoogleLoginComponent";
import FacebookLoginComponent from "../components/common/auth/FacebookLoginComponent";
import AppleLoginComponent from "../components/common/auth/AppleLoginComponent";
import { GoogleOAuthProvider } from "@react-oauth/google";
import { LoadingOutlined } from '@ant-design/icons';

const HostSignUpPage = () => {
  const history = useNavigate();

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmationPassword: "",
    phoneNumber: "",
    countryCode: "+94",
    otp: ""
  });

  const [errors, setErrors] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmationPassword: "",
    phoneNumber: "",
    otp: ""
  });
  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [showConfirmationPassword, setShowConfirmationPassword] = useState<boolean>(false);
  const [showOTPForm, setShowOTPForm] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);


  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const GetOTPCodeToEmail = () => {

    if (!validateForm()) return;

    setLoadingState(true)
    requestOTPInRegister(formData.email, SignUpValueEnum.CUSTOMER_EMAIL_SIGN_UP, formData.firstName, formData.lastName)
      .then((response) => {
        customToastMsg(response?.message, 1);
        setShowOTPForm(true);
      })
      .catch((error) => {
        if (error?.error_message) {
          customToastMsg(error.error_message, 0);
        } else {
          handleError(error);
        }
      }).finally(() => {
        setLoadingState(false)
      });

  };

  const SignUpFunction = () => {
    if (!formData.otp || formData.otp.length !== 6) {
      setErrors((prev) => ({ ...prev, otp: "Please enter the 6-digit OTP" }));
      return;
    }

    setLoadingState(true)
    const data = {
      email: formData.email.trim(),
      password: formData.password.trim(),
      firstName: formData.firstName,
      lastName: formData.lastName,
      countryCode: formData.countryCode,
      contactNo: formData.phoneNumber,
      otp: formData.otp,
      source: "HOST",
    };

    signUpService(data)
      .then((response) => {
        customToastMsg("Your account created successfully", 1);
        setShowOTPForm(false);
        history(`/login`);
      })
      .catch((error) => {
        if (error.message) {
          customToastMsg(error.message, 0);
        }
        error.message.email
          ? customToastMsg(error.message.email, 0)
          : error.message.password &&
          customToastMsg(error.message.password, 0);
      }).finally(() => {
        setLoadingState(false)
      });

  };

  const eyeOnAction = () => {
    setShowPassword((prevState) => !prevState);
  };
  const confirmationPWEyeOnAction = () => {
    setShowConfirmationPassword((prevState) => !prevState);
  };

  const handlePhoneNumberChange = (phone: string, countryData: CountryData) => {
    const dialCode = `${countryData.dialCode}`;

    let numberWithoutCode = phone.startsWith(dialCode)
      ? phone.slice(dialCode.length)
      : phone;

    if (numberWithoutCode.startsWith("0")) {
      numberWithoutCode = numberWithoutCode.slice(1);
    }

    setFormData((prev) => ({
      ...prev,
      phoneNumber: numberWithoutCode,
      countryCode: `+${dialCode}`
    }));

    if (!numberWithoutCode || numberWithoutCode.trim() === "") {
      setErrors((prev) => ({ ...prev, phoneNumber: "Please input the Contact Number" }));
    } else if (numberWithoutCode.length > 15) {
      setErrors((prev) => ({ ...prev, phoneNumber: "You cannot exceed 15 characters" }));
    } else {
      const { isValid, errorMessage } = validateInputs(numberWithoutCode, ["isContactNo"]);
      setErrors((prev) => ({ ...prev, phoneNumber: isValid ? "" : errorMessage }));
    }
  }

  const validateForm = (): boolean => {
    const newErrors: any = {};

    if (!formData.firstName) newErrors.firstName = "Enter your first name";
    if (!formData.lastName) newErrors.lastName = "Enter your last name";
    if (!formData.phoneNumber) newErrors.phoneNumber = "Enter your contact number";
    if (!formData.email) {
      newErrors.email = "Enter your email";
    } else if (!validateInputs(formData.email, ["isEmail"]).isValid) {
      newErrors.email = validateInputs(formData.email, ["isEmail"]).errorMessage;
    }
    if (!formData.password) {
      newErrors.password = "Enter a valid password";
    } else if (!validateInputs(formData.password, ["isPasswordValid"]).isValid) {
      newErrors.password = validateInputs(formData.password, ["isPasswordValid"]).errorMessage;
    }
    if (!formData.confirmationPassword) {
      newErrors.confirmationPassword = "Enter confirmation password";
    } else if (formData.confirmationPassword !== formData.password) {
      newErrors.confirmationPassword = "Passwords do not match";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  return (
    <>
      <main className="main_login w-100 d-flex justify-content-center align-items-center">
        <div className="login-container  ">
          <div className="login-image left-area">
            <img className="lft-img" src={bgImage} alt="Illustration" />
          </div>

          <div className=" position-relative d-flex right-area justify-content-start align-items-center flex-column" style={{ overflowY: "auto" }}>
            <div className="login-form">
              <img
                width={110}
                className="logo-imagepng"
                style={{ cursor: "pointer" }}
                src={blueLogo}
                alt="logo"
                onClick={() => {
                  history("/");
                }}
              />

              {showOTPForm ? (
                <h3 className="text-start mb-0 mt-3 d-flex align-items-center">
                  <ArrowLeft
                    className="me-1"
                    onClick={() => {
                      setShowOTPForm(false);
                      setFormData((prev) => ({ ...prev, ["otp"]: "" }));
                    }}
                  />
                  Verify your email
                </h3>
              ) : (
                <h3 className="text-start mb-0 mt-3">
                  Welcome to Serviced Apartments LK!
                </h3>
              )}
              <p className="text-start text-muted mb-4">
                {showOTPForm
                  ? `Enter the code we emailed to ${formData.email}`
                  : "Please enter your details to create your account."}
              </p>
              {!showOTPForm ? (
                <form
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default form submission
                      GetOTPCodeToEmail();
                    }
                  }}
                >
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="form-label font-weight-medium font-size-4 text-gray-secondary"
                    >
                      First Name
                    </label>
                    <input
                      type="text"
                      className="form-control custom-input"
                      id="firstName"
                      value={formData.firstName}
                      onChange={(e) => handleInputChange("firstName", e.target.value)}
                      placeholder="Enter your first name"
                    />
                    {errors.firstName && <div className="text-danger">{errors.firstName}</div>}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="form-label font-weight-medium font-size-4 text-gray-secondary"
                    >
                      Last Name
                    </label>
                    <input
                      type="text"
                      value={formData.lastName}
                      className="form-control custom-input"
                      id="lastName"
                      onChange={(e) => handleInputChange("lastName", e.target.value)}
                      placeholder="Enter your last name"
                    />
                    {errors.lastName && <div className="text-danger">{errors.lastName}</div>}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="phoneNumber"
                      className="form-label font-weight-medium font-size-4 text-gray-secondary"
                    >
                      Contact Number
                    </label>

                    <PhoneInput
                      country={"lk"}
                      value={`${formData.countryCode}${formData.phoneNumber}`}
                      inputStyle={{
                        width: "100%",
                        height: "43px",
                        borderRadius: "8px",
                        border: "1px solid #d9d9d9",
                        fontSize: "14px",
                      }}
                      placeholder="+94 xxx xxx xxx"
                      containerClass="phone-input-custom"
                      onChange={handlePhoneNumberChange}
                    />
                    {errors.phoneNumber && <div className="text-danger">{errors.phoneNumber}</div>}
                  </div>
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="form-label font-weight-medium font-size-4 text-gray-secondary"
                    >
                      Email
                    </label>
                    <input
                      type="email"
                      value={formData.email}
                      className="form-control custom-input"
                      id="email"
                      onChange={(e) => handleInputChange("email", e.target.value)}
                      placeholder="Enter your email"
                    />
                    {errors.email && <div className="text-danger">{errors.email}</div>}
                  </div>

                  <div className="mb-4">
                    <label className="form-label font-weight-medium text-gray-secondary">
                      Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showPassword === false ? "password" : "text"}
                        value={formData.password}
                        className="form-control custom-input"
                        id="password"
                        onChange={(e) => handleInputChange("password", e.target.value)}
                        placeholder="Enter your password"
                      />
                      <span className="input-group-text" onClick={eyeOnAction}>
                        {showPassword === false ? (
                          <img
                            style={{ color: "#EF5A60" }}
                            src={svgTwo}
                            alt="eye-off"
                          />
                        ) : (
                          <img
                            style={{ color: "#EF5A60" }}
                            src={openImage}
                            alt="eye-on"
                          />
                        )}
                      </span>
                    </div>
                    {errors.password && <div className="text-danger">{errors.password}</div>}
                  </div>
                  <div className="mb-4">
                    <label className="form-label font-weight-medium text-gray-secondary">
                      Confirmation Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmationPassword === false ? "password" : "text"}
                        value={formData.confirmationPassword}
                        className="form-control custom-input"
                        id="confirmationPassword"
                        onChange={(e) => handleInputChange("confirmationPassword", e.target.value)}
                        placeholder="Enter your confirmation password"
                      />
                      <span className="input-group-text" onClick={confirmationPWEyeOnAction}>
                        {showConfirmationPassword === false ? (
                          <img
                            style={{ color: "#EF5A60" }}
                            src={svgTwo}
                            alt="eye-off"
                          />
                        ) : (
                          <img
                            style={{ color: "#EF5A60" }}
                            src={openImage}
                            alt="eye-on"
                          />
                        )}
                      </span>
                    </div>
                    {errors.confirmationPassword && <div className="text-danger">{errors.confirmationPassword}</div>}
                  </div>

                  <div className="mb-4 form-check">
                    <input
                      type="checkbox"
                      className="form-check-input custom-checkbox"
                      id="rememberMe"
                    />
                    <label className="form-check-label text-gray-secondary font-size-5">
                      Remember me
                    </label>
                    {/* <a href="#" className="float-end text-decoration-none">
                    Forgot password?
                  </a> */}
                  </div>

                  <Button
                    onClick={() => {
                      GetOTPCodeToEmail();
                    }}
                    type="primary"
                    disabled={loadingState}
                    className="w-100 mb-3 mb-3"

                  >
                    {loadingState ? <span><LoadingOutlined className="me-3" />Loading</span> : " Create Account"}

                  </Button>
                  {/* <button type="button" className="btn btn-google w-100 mb-3">
                  <i className="bi bi-google me-2"></i> Log in with Google
                </button> */}
                </form>
              ) : (
                <form
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default form submission
                      SignUpFunction();
                    }
                  }}
                >
                  <div className="mb-4">
                    <label
                      htmlFor="email"
                      className="form-label font-weight-medium font-size-4 text-gray-secondary"
                    >
                      Enter your verification code
                    </label>
                    <div>
                      <Input.OTP
                        size="large"
                        length={6}
                        value={formData.otp || ""}
                        onChange={(value) => {
                          handleInputChange("otp", value || "");
                        }}
                        onInput={(e: any) => {
                          if (!e.target.value) {
                            handleInputChange("otp", "");
                          }
                        }}
                        onKeyDown={(e) => {
                          if (e.key === "Backspace" || e.key === "Delete") {
                            const target = e.target as HTMLInputElement;
                            if (!target.value) {
                              handleInputChange("otp", "");
                            }
                          }
                        }}
                      />
                      {errors.otp && <div className="text-danger">{errors.otp}</div>}
                    </div>
                  </div>

                  <p className="text-start text-muted signup-link">
                    Didn't get an email?{" "}
                    <a
                      className="text-decoration-none primary-color underline"
                      style={{ cursor: "pointer" }}
                      onClick={() => {
                        GetOTPCodeToEmail();
                      }}
                    >
                      Try again
                    </a>
                  </p>

                  <Button
                    onClick={() => {
                      SignUpFunction();
                    }}
                    type="primary"
                    className="w-100 mb-3 mb-3"
                    disabled={loadingState || formData.otp.length !== 6}
                  >
                    {loadingState ? <span><LoadingOutlined className="me-3" />Loading</span> : "Verify Account"}
                  </Button>
                </form>
              )}

              {!showOTPForm && (
                <p className="text-start text-muted signup-link">
                  Already have an account?{" "}
                  <a
                    href="/login"
                    className="text-decoration-none primary-color"
                  >
                    Sign In
                  </a>
                </p>
              )}

              <Divider className="text-gray font-weight-normal">
                or use one of these options
              </Divider>
              <div className="d-flex justify-content-center align-item-center">
                <GoogleOAuthProvider
                  clientId={import.meta.env.VITE_AUTH_GOOGLE_ID || "default-google-client-id"}
                >
                  <GoogleLoginComponent />
                </GoogleOAuthProvider>

                <FacebookLoginComponent />
                <AppleLoginComponent />
              </div>
              <p className="font-size-5 text-center mt-4">
                By signing in or creating an account, you agree with our{" "}
                <a
                  href="/terms-and-conditions"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-color"
                  style={{
                    cursor: "pointer",
                    marginLeft: "4px",
                    marginRight: "4px",
                    textDecoration: "none",
                  }}
                >
                  Terms & Conditions
                </a>{" "}
                and{" "}
                <a
                  href="/privacy-policy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="primary-color"
                  style={{
                    cursor: "pointer",
                    marginLeft: "4px",
                    marginRight: "4px",
                    textDecoration: "none",
                  }}
                >
                  Privacy Policy
                </a>
                .
              </p>
              <Divider />
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default HostSignUpPage;
