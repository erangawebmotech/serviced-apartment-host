import "../styles/login/loginStyles.scss";
import "../styles/commonStyles.scss";
import "../styles/contactNumberInputCustomStyle.scss";
import bgImage from "../assets/images/resetPwImg.jpg";
import { OTPValidateInForgetPassword, passwordResetInForgetPassword, requestOTPInForgetPassword } from "../service/auth";
import { useNavigate } from "react-router-dom";
import { customToastMsg, handleError } from "../common/commonFunctions";
import { useState } from "react";
import openImage from "../assets/images/line-md--watch.svg";
import blueLogo from "../assets/images/logo/Logo.png";
import svgTwo from "../assets/images/line-md--watch-off (1).svg";
import { Button, Divider, Input } from "antd";
import { ArrowLeft } from "react-feather";
import { validateInputs } from "../common/validation";
import { PasswordActionTypeEnum } from "../common/enums/passwordActionTypeEnum";
import { LoadingOutlined } from '@ant-design/icons';

const ForgetPasswordPage = () => {
  const history = useNavigate();

  const [formData, setFormData] = useState({
    email: "",
    otp: "",
    newPassword: "",
    confirmationPassword: ""
  });

  const [errors, setErrors] = useState<{
    email?: string;
    otp?: string;
    newPassword?: string;
    confirmationPassword?: string;
  }>({});

  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmationPassword, setShowConfirmationPassword] = useState<boolean>(false);
  const [showOTPForm, setShowOTPForm] = useState<boolean>(false);
  const [showPasswordResetForm, setShowPasswordResetForm] = useState<boolean>(false);

  const [loadingState, setLoadingState] = useState<boolean>(false);

  const handleInputChange = (field: keyof typeof formData, value: string) => {
    setFormData((prev) => ({ ...prev, [field]: value }));
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const GetOTPCodeToEmail = () => {
    if (!formData.email) {
      setErrors((prev) => ({ ...prev, email: "Enter your email" }));
      return;
    }
    if (!validateInputs(formData.email, ["isEmail"]).isValid) {
      setErrors((prev) => ({ ...prev, email: validateInputs(formData.email, ["isEmail"]).errorMessage }));
      return;
    }
    setLoadingState(true)
    requestOTPInForgetPassword(formData.email, PasswordActionTypeEnum.UPDATE_PASSWORD,)
      .then((response) => {
        setShowOTPForm(true)
        setShowPasswordResetForm(false)
        customToastMsg(response?.message, 1);
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

  const ValidateOTP = () => {
    if (!formData.otp) {
      setErrors((prev) => ({ ...prev, otp: `Enter the OTP sent to ${formData.email}` }));
      return;
    }
    setLoadingState(true)
    OTPValidateInForgetPassword(formData.email, formData.otp)
      .then((response) => {
        setShowOTPForm(false)
        setShowPasswordResetForm(true)
        customToastMsg(response?.message, 1);
      })
      .catch((error) => {
        if (error?.error_message) {
          customToastMsg(error.error_message, 0);
        } else {
          handleError(error);
        }
      }).finally(() => {
        setLoadingState(false)
      });;

  };

  const ResetPasswordFunction = () => {
    const { newPassword, confirmationPassword, otp } = formData;
    const newErrors: typeof errors = {};

    if (!newPassword) newErrors.newPassword = "Enter a new password";
    else if (!validateInputs(formData.newPassword, ["isPasswordValid"]).isValid)
      newErrors.newPassword = validateInputs(formData.newPassword, ["isPasswordValid"]).errorMessage;

    if (!confirmationPassword) newErrors.confirmationPassword = "Enter confirmation password";
    else if (confirmationPassword !== newPassword)
      newErrors.confirmationPassword = "Passwords do not match.";

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setLoadingState(true)
    const data = {
      email: formData.email.trim(),
      newPassword: newPassword.trim(),
      otp,
      passwordActionType: PasswordActionTypeEnum.RESET_PASSWORD
    }

    passwordResetInForgetPassword(data)
      .then((response) => {
        customToastMsg(response?.message, 1);
        history(`/login`);
      })
      .catch((error) => {
        if (error.message) {
          customToastMsg(error.message, 0);
        }
        error.message.newPassword
          ? customToastMsg(error.message.newPassword, 0)
          : error.message.otp &&
          customToastMsg(error.message.otp, 0);
      }).finally(() => {
        setLoadingState(false)
      });;

  };

  const eyeOnAction = () => {
    setShowNewPassword((prevState) => !prevState);
  };

  const confirmationPWEyeOnAction = () => {
    setShowConfirmationPassword((prevState) => !prevState);
  };

  return (
    <>
      <main className="main_login w-100 d-flex justify-content-center align-items-center">
        <div className="login-container  ">
          <div className="login-image left-area">
            <img className="lft-img" src={bgImage} alt="Illustration" />
          </div>

          <div className=" position-relative d-flex right-area justify-content-center align-items-center flex-column" style={{ overflowY: "auto" }}>
            <div className="login-form">
              <img
                width={110}
                className="logo-imagepng"
                src={blueLogo}
                alt="logo"
                style={{ cursor: "pointer" }}
                onClick={() => {
                  history("/");
                }}
              />

              {showPasswordResetForm ? (
                <h3 className="text-start mb-0 mt-3 d-flex align-items-center">
                  <ArrowLeft
                    className="me-1"
                    onClick={() => {
                      setShowOTPForm(false);
                      setShowPasswordResetForm(false);
                      handleInputChange("newPassword", "");
                      handleInputChange("confirmationPassword", "");
                      handleInputChange("otp", "");
                      handleInputChange("email", "");
                      setFormData((prev) => ({ ...prev, ["otp"]: "" }));
                    }}
                  />
                  Create New Password
                </h3>
              ) : showOTPForm ? (
                <h3 className="text-start mb-0 mt-3 d-flex align-items-center">
                  <ArrowLeft
                    className="me-1"
                    onClick={() => {
                      setShowOTPForm(false);
                      handleInputChange("email", "");
                      setFormData((prev) => ({ ...prev, ["otp"]: "" }));
                    }}
                  />
                  Verify your email
                </h3>
              ) : (
                <h3 className="text-start mb-0 mt-3">
                  <ArrowLeft
                    className="me-1"
                    onClick={() => {
                      history("/login");
                    }}
                  />
                  Forget Password
                </h3>
              )}
              <p className="text-start text-muted mb-4">
                {showPasswordResetForm
                  ? `Your identification has been verified.Set your new password`
                  : showOTPForm
                    ? `Please enter the code we emailed to ${formData.email}`
                    : "Please enter your email to receive a verification code."}
              </p>
              {showPasswordResetForm ? (
                <form
                  onKeyDown={(e) => {
                    if (e.key === "Enter") {
                      e.preventDefault(); // Prevent default form submission
                      ResetPasswordFunction();
                    }
                  }}
                >
                  <div className="mb-4">
                    <label className="form-label font-weight-medium text-gray-secondary">
                      New Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showNewPassword === false ? "password" : "text"}
                        className="form-control custom-input"
                        id="newPassword"
                        onChange={(e) => handleInputChange("newPassword", e.target.value)}
                        placeholder="Enter your new password"
                      />
                      <span className="input-group-text" onClick={eyeOnAction}>
                        {showNewPassword === false ? (
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
                    {errors.newPassword && <div className="text-danger">{errors.newPassword}</div>}
                  </div>
                  <div className="mb-4">
                    <label className="form-label font-weight-medium text-gray-secondary">
                      Confirmation Password
                    </label>
                    <div className="input-group">
                      <input
                        type={showConfirmationPassword === false ? "password" : "text"}
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

                  <Button
                    onClick={() => {
                      ResetPasswordFunction();
                    }}
                    disabled={loadingState}
                    type="primary"
                    className="w-100 my-3 "

                  >
                    {loadingState ? <span><LoadingOutlined className="me-3" />Loading</span> : "Update"}
                  </Button>
                </form>
              ) :
                showOTPForm ? (
                  <form
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault(); // Prevent default form submission
                        ValidateOTP();
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
                          value={formData.otp}
                          onChange={(val) => handleInputChange("otp", val ?? "")}
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
                        ValidateOTP();
                      }}
                      disabled={loadingState || formData.otp.length !== 6}
                      type="primary"
                      className="w-100 my-3"
                    >
                      {loadingState ? <span><LoadingOutlined className="me-3" />Loading</span> : "Verify Account"}
                    </Button>
                  </form>
                ) : (
                  <form
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        GetOTPCodeToEmail();
                      }
                    }}
                  >

                    <div className="mb-4">
                      <label
                        htmlFor="email"
                        className="form-label font-weight-medium font-size-4 text-gray-secondary"
                      >
                        Email
                      </label>
                      <input
                        type="text"
                        className="form-control custom-input"
                        id="email"
                        value={formData.email}
                        onChange={(e) => handleInputChange("email", e.target.value)}
                        placeholder="Enter your email"
                      />
                      {errors.email && <div className="text-danger">{errors.email}</div>}
                    </div>

                    <Button
                      onClick={() => {
                        GetOTPCodeToEmail();
                      }}
                      disabled={loadingState}
                      type="primary"
                      className="w-100 my-3 "

                    >
                      {loadingState ? <span><LoadingOutlined className="me-3" />Loading</span> : " Send OTP"}

                    </Button>
                  </form>
                )}

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
export default ForgetPasswordPage;