import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Card } from "antd";
import { customToastMsg, handleError } from "../../../common/commonFunctions";
import { facebookLoginService } from "../../../service/auth";
import { Cookies } from "typescript-cookie";
import * as constants from "../../../common/constants";

declare global {
  interface Window {
    fbAsyncInit: () => void;
    FB: any;
  }
}

const FacebookLoginComponent: React.FC = () => {
  const [sdkLoaded, setSdkLoaded] = useState(false);
  const history = useNavigate();

  useEffect(() => {
    const loadSDK = () => {
      if (document.getElementById("facebook-jssdk")) return;

      const script = document.createElement("script");
      script.id = "facebook-jssdk";
      script.src = "https://connect.facebook.net/en_US/sdk.js";
      script.async = true;
      script.defer = true;
      document.body.appendChild(script);

      const appId = import.meta.env.VITE_AUTH_FACEBOOK_ID;

      window.fbAsyncInit = () => {
        window.FB.init({
          appId: appId,
          cookie: true,
          xfbml: false,
          version: "v18.0",
        });
        setSdkLoaded(true);
      };
    };

    loadSDK();
  }, []);

  const handleLogin = () => {
    if (!sdkLoaded || !window.FB) {
      customToastMsg("Facebook SDK not loaded yet", 2);
      return;
    }

    if (window.location.protocol !== "https:") {
      customToastMsg("Facebook Login only works on HTTPS.", 0);
      return;
    }

    window.FB.login(
      (response: any) => {
        if (response.status === "connected") {
          const { accessToken } = response.authResponse;

          window.FB.api(
            "/me",
            { fields: "name,email,picture" },
            (user: any) => {
              // Save to localStorage or pass via navigation state
              // history("/facebook-callback", {
              //   state: { user, accessToken },
              // });
              faceBookLogin(accessToken);
            }
          );
        } else {
          customToastMsg("Facebook login cancelled.", 0);
        }
      },
      { scope: "public_profile,email" }
    );
  };

  const faceBookLogin = (token: string) => {
    const payload = { 
      access_token: token,
      source: "HOST",
     };
     
    facebookLoginService(payload)
      .then((response) => {
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
      })
      .catch((error) => {
        handleError(error);
      });
  };

  return (
    <Card
      hoverable
      bordered
      style={{ width: 55, height: 55 }}
      className="d-flex justify-content-center align-items-center mx-2"
      onClick={handleLogin}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 32 32"
        width="24"
        height="24"
      >
        <path fill="#1877F2" d="M32 0v32H0V0z" />
        <path
          fill="#FFF"
          d="M22.94 16H18.5v-3c0-1.27.62-2.5 2.6-2.5h2.02V6.56s-1.83-.31-3.58-.31c-3.65 0-6.04 2.21-6.04 6.22V16H9.44v4.63h4.06V32h5V20.62h3.73l.7-4.62z"
        />
      </svg>
    </Card>
  );
};

export default FacebookLoginComponent;
