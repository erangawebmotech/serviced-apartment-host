import "../styles/login/loginStyles.scss";
import "../styles/commonStyles.scss";
import bgImage from "../assets/images/signUpImage2.jpg";
import { firstTimePasswordReset } from "../service/auth";
import { useLocation, useNavigate } from "react-router-dom";
import { customToastMsg } from "../common/commonFunctions";
import { useEffect, useState } from "react";
import openImage from "../assets/images/line-md--watch.svg";
import blueLogo from "../assets/images/logo/Logo.png";
import svgTwo from "../assets/images/line-md--watch-off (1).svg";
import { PasswordActionTypeEnum } from "../common/enums/passwordActionTypeEnum";
import { LoadingOutlined } from '@ant-design/icons';
import { Button } from "antd";
import { validateInputs } from "../common/validation";


const FirstTimeLoginPasswordResetPage = () => {
  const history = useNavigate();
  const location = useLocation();

  const [formData, setFormData] = useState({
    oldPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });

  const [errors, setErrors] = useState({
    oldPassword: "",
    newPassword: "",
    confirmationPassword: "",
  });


  const [email, setEmail] = useState<string>("");
  const [firstTimePw, setFirstTimePw] = useState<string>("");

  const [showOldPassword, setShowOldPassword] = useState<boolean>(false);
  const [showNewPassword, setShowNewPassword] = useState<boolean>(false);
  const [showConfirmationPassword, setShowConfirmationPassword] = useState<boolean>(false);

  const [loadingState, setLoadingState] = useState<boolean>(false);

  useEffect(() => {
    const { state } = location;
    if (state && state.email) {
      const { email } = state;
      setEmail(email);
    }

    if (state && state.oldPW) {
      const { oldPW } = state;
      setFirstTimePw(oldPW);
    }
  }, [location]);

  const handleChange = (field: keyof typeof formData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    setErrors(prev => ({ ...prev, [field]: "" })); // Clear error on change
  };

  const validateForm = () => {
    let tempErrors = { oldPassword: "", newPassword: "", confirmationPassword: "" };
    let valid = true;

    if (!formData.oldPassword) {
      tempErrors.oldPassword = "Enter old password";
      valid = false;
    } else if (formData.oldPassword !== firstTimePw) {
      tempErrors.oldPassword = "Old passwords do not match.";
      valid = false;
    }

    if (!formData.newPassword) {
      tempErrors.newPassword = "Enter new password";
      valid = false;
    } else if (!validateInputs(formData.newPassword, ["isPasswordValid"]).isValid) {
      tempErrors.newPassword = validateInputs(formData.newPassword, ["isPasswordValid"]).errorMessage;
      valid = false;
    }

    if (!formData.confirmationPassword) {
      tempErrors.confirmationPassword = "Enter confirmation password";
      valid = false;
    } else if (formData.confirmationPassword !== formData.newPassword) {
      tempErrors.confirmationPassword = "Passwords do not match.";
      valid = false;
    }

    setErrors(tempErrors);
    return valid;
  };


  const firstTimePasswordResetFunction = () => {
    if (!validateForm()) return;

    setLoadingState(true)
    const data = {
      email: email,
      oldPassword: formData.oldPassword.trim(),
      newPassword: formData.newPassword.trim(),
      passwordActionType: PasswordActionTypeEnum.FIRST_TIME_RESET_PASSWORD
    };

    firstTimePasswordReset(data)
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
          : error.message.oldPassword && customToastMsg(error.message.oldPassword, 0);
      }).finally(() => {
        setLoadingState(false)
      });
  };

  const oldPWEyeOnAction = () => {
    setShowOldPassword((prevState) => !prevState);
  };
  const newPWEyeOnAction = () => {
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

          <div className="position-relative d-flex right-area justify-content-start justify-content-xxl-center pt-0 pt-xxl-5 align-items-center flex-column" style={{ overflowY: "auto" }}>
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
              <h3 className="text-start mb-0 mt-3 mb-1">Update your password!</h3>
              <p className="text-start text-muted mb-4">
                You need to update your password because this is the first time you signed in.
              </p>
              <h3 className="font-size-3 text-start mt-3 mb-4">Email : {email}</h3>
              <form
                onKeyDown={(e) => {
                  if (e.key === "Enter") {
                    e.preventDefault();
                    firstTimePasswordResetFunction();
                  }
                }}
              >

                <div className="mb-4">
                  <label className="form-label font-weight-medium text-gray-secondary">
                    Old Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showOldPassword === false ? "password" : "text"}
                      className="form-control custom-input"
                      id="password"
                      onChange={e => handleChange("oldPassword", e.target.value)}
                      placeholder="Enter your old password"
                    />
                    <span className="input-group-text" onClick={oldPWEyeOnAction}>
                      {showOldPassword === false ? (
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
                  {errors.oldPassword && <div className="text-danger">{errors.oldPassword}</div>}
                </div>
                <div className="mb-4">
                  <label className="form-label font-weight-medium text-gray-secondary">
                    New Password
                  </label>
                  <div className="input-group">
                    <input
                      type={showNewPassword === false ? "password" : "text"}
                      className="form-control custom-input"
                      id="password"
                      onChange={e => handleChange("newPassword", e.target.value)}
                      placeholder="Enter your new password"
                    />
                    <span className="input-group-text" onClick={newPWEyeOnAction}>
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
                      onChange={e => handleChange("confirmationPassword", e.target.value)}
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
                  onClick={firstTimePasswordResetFunction}
                  type="primary"
                  disabled={loadingState}
                  className="w-100 my-3"
                >
                  {loadingState ? <span><LoadingOutlined className="me-3" />Loading</span> : "Update"}
                </Button>

                <p className="font-size-5 text-center mt-3">
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
              </form>
            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default FirstTimeLoginPasswordResetPage;
