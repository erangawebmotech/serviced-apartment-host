import React, { useEffect } from "react";
import { Card } from "antd";
import { useNavigate } from "react-router-dom";
import { customToastMsg, handleError } from "../../../common/commonFunctions";
import { appleLoginService } from "../../../service/auth";
import { Cookies } from "typescript-cookie";
import * as constants from "../../../common/constants";

interface AppleID {
  auth: {
    init: (config: {
      clientId: string;
      scope: string;
      redirectURI: string;
      state?: string;
      usePopup?: boolean;
    }) => void;
    signIn: () => Promise<any>;
  };
}

declare global {
  interface Window {
    AppleID: AppleID;
  }
}

const AppleLoginComponent: React.FC = () => {
  const history = useNavigate();

  useEffect(() => {
    const script = document.createElement("script");
    script.src = "https://appleid.cdn-apple.com/appleauth/static/jsapi/appleid/1/en_US/appleid.auth.js";
    script.async = true;
    const clientId = import.meta.env.VITE_AUTH_APPLE_CLIENT_ID || "default-apple-client-id";

    // console.log(typeof clientId);
    //  console.log(`${import.meta.env.VITE_HOST_URL}/login`);


    script.onload = () => {
      window.AppleID.auth.init({
        clientId: clientId,
        scope: "name email",
        redirectURI: `${import.meta.env.VITE_HOST_URL}/login`,
        usePopup: true, // Use popup so page doesn't reload
      });
    };
    document.body.appendChild(script);
  }, []);

  // function parseJwt(token: string) {
  //   const base64Url = token.split('.')[1];
  //   const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
  //   const jsonPayload = decodeURIComponent(
  //     atob(base64)
  //       .split('')
  //       .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
  //       .join('')
  //   );

  //   return JSON.parse(jsonPayload);
  // }

  const handleAppleLogin = () => {
    if (!window.AppleID) {
      customToastMsg("Apple SDK not loaded yet.", 2);
      return;
    }

    window.AppleID.auth
      .signIn()
      .then((response: any) => {
        const { authorization, user } = response;
        const id_token = authorization?.id_token;

        const payload = {
          identityToken: id_token,
          source: "HOST",
        };

        // const decoded = parseJwt(id_token);
        // console.log(decoded);

        // Send to backend
        appleLoginService(payload)
          .then((res) => {
            const data = res?.data;

            const isLocalhost = window.location.hostname === "localhost";
            const domain = isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH;

            Cookies.set(constants.AUTH_USER_HOST, JSON.stringify(data?.user), {
              domain,
              path: "/",
              sameSite: "lax",
            });

            Cookies.set(constants.ACCESS_TOKEN_HOST, data?.access_token, {
              domain,
              path: "/",
              sameSite: "lax",
            });

            Cookies.set(constants.REFRESH_TOKEN_HOST, data?.refresh_token, {
              domain,
              path: "/",
              sameSite: "lax",
            });

            history("/");
            // history("/dashboard");
          })
          .catch((error) => {
            handleError(error);
          });
      })
      .catch((err: any) => {
        customToastMsg("Apple login failed.", 0);
      });
  };

  return (
    <Card
      hoverable
      bordered
      style={{ width: 55, height: 55 }}
      className="d-flex justify-content-center align-items-center mx-2"
      onClick={handleAppleLogin}
    >
      <svg xmlns="http://www.w3.org/2000/svg" height="24" width="24" viewBox="0 -3.552713678800501e-15 820 950"><path d="M404.345 229.846c52.467 0 98.494-20.488 138.08-61.465s59.38-88.626 59.38-142.947c0-5.966-.472-14.444-1.414-25.434-6.912.942-12.096 1.727-15.552 2.355-48.383 6.908-90.954 30.615-127.713 71.12-36.758 40.506-55.137 83.838-55.137 129.996 0 5.337.785 14.13 2.356 26.375zM592.379 950c37.387 0 78.701-25.59 123.943-76.772S796.122 761.915 820 692.836c-88.912-45.844-133.368-111.626-133.368-197.348 0-71.591 35.973-132.82 107.92-183.688-49.954-62.486-115.931-93.729-197.931-93.729-34.56 0-66.134 5.181-94.724 15.543l-17.908 6.594-24.035 9.42c-15.709 5.966-30.004 8.95-42.885 8.95-10.054 0-23.25-3.455-39.586-10.363l-18.38-7.536-17.436-7.065c-25.449-10.676-52.782-16.014-82-16.014-78.23 0-141.065 26.376-188.506 79.128C23.72 349.479 0 419.03 0 505.379c0 121.517 38.015 233.772 114.046 336.763C166.828 914.047 215.054 950 258.724 950c18.537 0 36.916-3.611 55.138-10.833l23.092-9.42 18.38-6.594c25.762-9.106 49.482-13.659 71.16-13.659 22.935 0 49.326 5.81 79.173 17.427l14.609 5.652C550.75 944.191 574.786 950 592.379 950z" /></svg>
    </Card>
  );
};

export default AppleLoginComponent;
