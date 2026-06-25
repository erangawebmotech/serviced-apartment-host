import "../styles/login/loginStyles.scss";
import "../styles/commonStyles.scss";
import bgImage from "../assets/images/logInImage.jpg";
import * as constants from "../common/constants";
import { loginService } from "../service/auth";
import { Cookies } from "typescript-cookie";
import { useNavigate } from "react-router-dom";
import { customToastMsg } from "../common/commonFunctions";
import { useState } from "react";
import openImage from "../assets/images/line-md--watch.svg";
import blueLogo from "../assets/images/logo/Logo.png";
import svgTwo from "../assets/images/line-md--watch-off (1).svg";
import { Button, Divider, Input } from "antd";
import { GoogleOAuthProvider } from "@react-oauth/google";
import GoogleLoginComponent from "../components/common/auth/GoogleLoginComponent";
import FacebookLoginComponent from "../components/common/auth/FacebookLoginComponent";
import AppleLoginComponent from "../components/common/auth/AppleLoginComponent";
import { LoadingOutlined } from '@ant-design/icons';
import { getSigninSchema, SigninSchemaType } from "../schema/signInSchema";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from '@hookform/resolvers/zod';


const HostLoginPage = () => {
  const history = useNavigate();

  const [showPassword, setShowPassword] = useState<boolean>(false);
  const [loadingState, setLoadingState] = useState<boolean>(false);

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<SigninSchemaType>({
    resolver: zodResolver(getSigninSchema()),
    defaultValues: {
      email: "",
      password: "",
      rememberMe: true,
    },
  });

  const LoginFunction = (data: SigninSchemaType) => {
    setLoadingState(true)
    const payload = {
      email: data.email.trim(),
      password: data.password.trim(),
    };

    loginService(payload)
      .then((response) => {
        if (response?.data?.user?.isTempPwdRest === null || response?.data?.user?.isTempPwdRest) {

          // console.log(window.location.href);
          let url = window.location.href;
          const parsedUrl = new URL(url);
          const isLocalhost = parsedUrl.hostname === "localhost";
          Cookies.set(constants.AUTH_USER_HOST, JSON.stringify(response?.data?.user), {
            domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
            path: "/",
            sameSite: "lax",
          });

          Cookies.set(constants.ACCESS_TOKEN_HOST, response?.data?.access_token, {
            domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
            path: "/",
            sameSite: "lax",
          });

          Cookies.set(
            constants.REFRESH_TOKEN_HOST,
            response?.data?.refresh_token,
            {
              domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
              path: "/",
              sameSite: "lax",
            }
          );
          history("/");
          // history(`/dashboard`);
        } else {
          history("/reset-password", {
            state: {
              email: data.email.trim(),
              oldPW: data.password.trim(),
            },
          });
        }

      })
      .catch((error) => {
        if (error.message) {
          customToastMsg(error.message, 0);
        }
        error.message.email
          ? customToastMsg(error.message.email, 0)
          : error.message.password && customToastMsg(error.message.password, 0);
      }).finally(() => {
        setLoadingState(false)
      });
  };

  const eyeOnAction = () => {
    setShowPassword((prevState) => !prevState);
  };


  return (
    <>
      <main className="main_login w-100 d-flex justify-content-center align-items-center">
        <div className="login-container  ">
          <div className="login-image left-area">
            <img className="lft-img" src={bgImage} alt="Illustration" />
          </div>

          <div className="position-relative d-flex right-area justify-content-start align-items-center flex-column" style={{ overflowY: "auto" }}>
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
              <h3 className="text-start mb-0 mt-3">Welcome back!</h3>
              <p className="text-start text-muted mb-4">
                Please enter your details.
              </p>

              <form
                onSubmit={handleSubmit(LoginFunction)} noValidate
              >
                <div className="mb-4">
                  <label
                    htmlFor="email"
                    className="form-label font-weight-medium font-size-4 text-gray-secondary"
                  >
                    Email
                  </label>
                  <Controller
                    name="email"
                    control={control}
                    render={({ field }) => (
                      <Input
                        {...field}
                        type="text"
                        placeholder="Enter your email"
                        className="form-control custom-input"
                      />
                    )}
                  />
                  {errors.email && <p className="text-danger">{errors.email.message}</p>}
                </div>

                <div className="mb-4">
                  <label className="form-label font-weight-medium text-gray-secondary">
                    Password
                  </label>
                  <Controller
                    name="password"
                    control={control}
                    render={({ field }) => (
                      <div className="input-group">
                        <Input
                          {...field}
                          type={showPassword ? "text" : "password"}
                          className="form-control custom-input"
                          id="password"
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
                    )}
                  />
                  {errors.password && <p className="text-danger">{errors.password.message}</p>}
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
                  <label className="float-end text-gray-secondary font-size-5" style={{ cursor: "pointer" }} onClick={() => {
                    history(`/forget-password`);
                  }}>
                    Forgot password?
                  </label>
                </div>

                <Button
                  htmlType="submit"
                  type="primary"
                  className="w-100 mb-3"
                  disabled={loadingState}
                >
                  {loadingState ? <span><LoadingOutlined className="me-3" />Loading</span> : "Sign In"}
                </Button>

                <p className="text-start text-muted signup-link">
                  Don't have an account?{" "}
                  <a
                    href="/sign-up"
                    className="text-decoration-none primary-color"
                  >
                    Sign Up
                  </a>
                </p>

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
              </form>

            </div>
          </div>
        </div>
      </main>
    </>
  );
};
export default HostLoginPage;
