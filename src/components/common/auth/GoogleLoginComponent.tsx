import { Card } from "antd";
import React from "react";
import { useGoogleLogin } from "@react-oauth/google";
import { googleLoginService } from "../../../service/auth";
import { Cookies } from "typescript-cookie";
import * as constants from "../../../common/constants";
import { useNavigate } from "react-router-dom";
import { handleError } from "../../../common/commonFunctions";

const GoogleLoginComponent = () => {
  const history = useNavigate();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      //   console.log("Access Token:", tokenResponse.access_token);

      const payload = {
        accessToken: tokenResponse.access_token,
        source: "HOST",
      };
      
      googleLoginService(payload)
        .then((response) => {
          // console.log(window.location.href);
          let url = window.location.href;
          const parsedUrl = new URL(url);
          const isLocalhost = parsedUrl.hostname === "localhost";
          // console.log(import.meta.env.VITE_DOMAIN_PATH);

          Cookies.set(constants.AUTH_USER_HOST, JSON.stringify(response?.data?.user), {
            domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
            path: "/",
            sameSite: "lax",
          });

          Cookies.set(
            constants.ACCESS_TOKEN_HOST,
            response?.data?.access_token,
            {
              domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
              path: "/",
              sameSite: "lax",
            }
          );

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
        })
        .catch((error) => {
          handleError(error);
        });
    },
    onError: () => {
      // console.log("Login Failed");
    },
    flow: "implicit", // Use 'auth-code' for server-side token exchange
    scope:
      "openid profile email https://www.googleapis.com/auth/userinfo.email",
  });

  return (
    <Card
      hoverable
      bordered
      style={{ width: 55, height: 55 }}
      className="d-flex justify-content-center align-items-center mx-2"
      onClick={() => login()}
    >
      <svg
        viewBox="0 0 262 262"
        xmlns="http://www.w3.org/2000/svg"
        preserveAspectRatio="xMidYMid"
        aria-hidden="true"
        focusable="false"
        width="24"
        height="24"
        role="img"
      >
        <path
          d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622 38.755 30.023 2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
          fill="#4285F4"
        ></path>
        <path
          d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055-34.523 0-63.824-22.773-74.269-54.25l-1.531.13-40.298 31.187-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
          fill="#34A853"
        ></path>
        <path
          d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82 0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602l42.356-32.782"
          fill="#FBBC05"
        ></path>
        <path
          d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0 79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
          fill="#EB4335"
        ></path>
      </svg>
    </Card>
  );
};

export default GoogleLoginComponent;
