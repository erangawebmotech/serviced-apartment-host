import { toast } from "react-toastify";
import { AlertTriangle, Check, X } from "react-feather";
import Swal from "sweetalert2";
import withReactContent from "sweetalert2-react-content";
import { Cookies } from "typescript-cookie";
import * as constants from "../common/constants";
import { useNavigate } from "react-router-dom";
import { authUserDetailObj } from "./interfaces/uiNecessaryInterface";

export const MySwal = withReactContent(Swal);

type ToastType = 0 | 1 | 2 | 3;

export const customToastMsg = (message: string, type: ToastType) => {
  let msgType: "info" | "success" | "error" | "warning" = "info";

  if (type === 2) {
    msgType = "info";
  } else if (type === 0) {
    msgType = "error";
  } else if (type === 1) {
    msgType = "success";
  } else if (type === 3) {
    msgType = "warning";
  }

  toast[msgType](message, {
    position: "top-right",
    autoClose: 5000,
    hideProgressBar: false,
    closeOnClick: true,
    pauseOnHover: true,
    draggable: true,
    progress: undefined,
    theme: "light",
  });
};

export const isEmpty = (str: string | null): boolean => {
  return !str || str.length === 0;
};

interface SweetAlertTextInputProps {
  enabled: boolean;
  inputLabel?: string;
  placeholder?: string;
  errorMsg?: string;
}

export const customSweetAlert = (
  text: string,
  type: number,
  buttonEvent: (value: string) => void,
  title?: string,
  textInputProps?: SweetAlertTextInputProps
) => {
  let msgType: "success" | "error" | "warning" | "info" | "question" =
    "warning";
  if (type === 2) {
    msgType = "info";
  } else if (type === 0) {
    msgType = "error";
  } else if (type === 1) {
    msgType = "success";
  } else if (type === 3) {
    msgType = "warning";
  } else if (type === 4) {
    msgType = "question";
  }

  return MySwal.fire({
    title,
    text,
    icon: msgType,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    customClass: {
      confirmButton: "btn mr-2 mx-2 primary-bg-color text-white",
      cancelButton: "btn btn-outline-secondary mx-2",
      // content: "pt-1 pb-1",
      input: "mb-1 form-control alert-input-label",
      inputLabel: "mt-2 font-weight-bold",
    },
    buttonsStyling: false,
    input: textInputProps && textInputProps.enabled ? "textarea" : undefined,
    inputLabel: textInputProps?.inputLabel,
    inputPlaceholder: textInputProps?.placeholder,
    inputValidator: (value: any) => {
      if (!value) {
        return textInputProps?.errorMsg;
      }
    },
  }).then((result) => {
    if (result.isConfirmed) {
      buttonEvent(result.value as string);
    }
  });
};
export const customSweetAlertWithFunctions = (
  text: string,
  type: number,
  yesCallback: (value: string) => void,
  noCallback: (confirmed: boolean) => void,
  textInputProps?: SweetAlertTextInputProps,
  title?: string
) => {
  let msgType: "success" | "error" | "warning" | "info" | "question" =
    "warning";
  if (type === 2) {
    msgType = "info";
  } else if (type === 0) {
    msgType = "error";
  } else if (type === 1) {
    msgType = "success";
  } else if (type === 3) {
    msgType = "warning";
  }

  return MySwal.fire({
    title,
    text,
    icon: msgType,
    showCancelButton: true,
    confirmButtonText: "Yes",
    cancelButtonText: "No",
    allowOutsideClick: false,
    heightAuto: false,
    customClass: {
      confirmButton: "btn btn-primary mr-2 mx-2",
      cancelButton: "btn btn-outline-danger mx-2",
      // content: "pt-1 pb-1",
      input: "mb-1 form-control alert-input-label",
      inputLabel: "mt-2 font-weight-bold",
    },
    buttonsStyling: false,
    input: textInputProps && textInputProps.enabled ? "textarea" : undefined,
    inputLabel: textInputProps?.inputLabel,
    inputPlaceholder: textInputProps?.placeholder,
    inputValidator: (value: any) => {
      if (!value) {
        return textInputProps?.errorMsg;
      }
    },
  }).then(function (result) {
    if (result.value || result.isConfirmed) {
      yesCallback(result.value);
    } else {
      noCallback(result.isConfirmed);
    }
  });
};

export const handleError = (c: any) => {
  // console.log("F:", c);

  if (c?.message === "Unauthenticated.") {
    logOut();
    window.location.href = "/login";
    return;
  }
  if (c?.message === "NotFound.") {
    window.location.href = "/not-found";
    return;
  }

  if (c?.message?.error_message) {
    customToastMsg(c?.message?.error_message, 0);
    return;
  }
  if (c?.message) {
    customToastMsg(c?.message, 0);
    return;
  }

  // Fallback error message
  customToastMsg("Sorry! Try again later", 0);
};

export const handleErrorForCustom = (error: any) => {
  //console.log("error :", error);
};

export const countDescription = (packageDesc: string): number => {
  if (packageDesc === "") return 0;
  // Remove HTML tags using regular expression
  const strippedString = packageDesc.replace(/(<([^>]+)>)/gi, "");

  // Count actual characters
  return strippedString.length;
};

export const getCurrentDate = (): string => {
  const today = new Date();
  const yyyy = today.getFullYear();
  const mm = String(today.getMonth() + 1).padStart(2, "0"); // Months start at 0!
  const dd = String(today.getDate()).padStart(2, "0");
  return `${yyyy}-${mm}-${dd}`;
};

// export const checkPermission = (permissionType: string | string[]): boolean => {
//   const permissionCookie = Cookies.get(constant.PERMISSION);
//   if (!permissionCookie) {
//     window.location.href = "/logout";
//     return false;
//   }

//   const currentPermissions: string[] = JSON.parse(permissionCookie);
//   const pp: string[] = currentPermissions.map((p) => atob(p));

//   if (Array.isArray(permissionType)) {
//     return permissionType.some((type) => pp.includes(type));
//   } else {
//     return pp.includes(permissionType);
//   }
// };

export const checkPermission = (permissionType: string | string[]): boolean => {
  const permissionCookie = Cookies.get(constants.PERMISSION);

  if (!permissionCookie) {
    window.location.href = "/logout";
    return false;
  }

  if (typeof permissionCookie !== "string") {
    window.location.href = "/logout";
    return false;
  }

  try {
    const currentPermissions: string[] = JSON.parse(permissionCookie);

    const pp: string[] = currentPermissions.map((p) => atob(p));

    if (Array.isArray(permissionType)) {
      return permissionType.some((type) => pp.includes(type));
    } else {
      return pp.includes(permissionType);
    }
  } catch (error) {
    window.location.href = "/logout";
    return false;
  }
};

export const popUploader = (dispatch: any, val: boolean): void => {
  dispatch({ type: "IS_LOADER", value: { isLoader: val, type: 0 } });
};

// const SECRET_KEY = "service_apartment_listing";

export const setEncryptedCookie = (key: string, value: number) => {
  Cookies.set(key, value);
  // const encryptedValue = CryptoJS.AES.encrypt(value, SECRET_KEY).toString();
  // Cookies.set(key, encryptedValue);
};

// Function to get decrypted value from cookies
export const getDecryptedCookie = (key: string): number | null => {
  // const encryptedValue = Cookies.get(key);
  // if (!encryptedValue) return null;

  // try {
  //   const bytes = CryptoJS.AES.decrypt(encryptedValue, SECRET_KEY);
  //   const decryptedValue = bytes.toString(CryptoJS.enc.Utf8);
  //   return parseInt(decryptedValue) || null;
  // } catch (error) {
  //   console.error("Error decrypting cookie:", error);
  //   return null;
  // }
  const propertyId = Cookies.get(key) as string;
  return parseInt(propertyId);
};

// Function to remove a cookie
export const removeCookie = (key: string) => {
  Cookies.remove(key);
};

export const formatNamesCmnFun = (str: string): string => {
  return str
    .toLowerCase()
    .replace(/_/g, " ")
    .replace(/\b\w/g, (char) => char.toUpperCase());
};

export const getLastPathSegment = (url: string): string => {
  const segments = url.split("/");
  return segments[segments.length - 1];
};

export const checkAuthenticationViaAccessToken = (): boolean => {
  const hostAccessToken = Cookies.get(constants.ACCESS_TOKEN_HOST);
  const adminAccessToken = Cookies.get(constants.ACCESS_TOKEN);

  return Boolean(hostAccessToken || adminAccessToken);
};

export const checkAuthenticationViaAuthUser = (): boolean => {
  const hostAuthUser = Cookies.get(constants.AUTH_USER_HOST);
  const adminAuthUser = Cookies.get(constants.AUTH_USER);

  return Boolean(hostAuthUser || adminAuthUser);
};

export const checkAuthUserIsAdmin = (): boolean => {
  const authUserString = Cookies.get(constants.AUTH_USER_HOST)
    ? Cookies.get(constants.AUTH_USER_HOST)
    : Cookies.get(constants.AUTH_USER);
  if (authUserString) {
    const authUser: authUserDetailObj = JSON.parse(authUserString as string);

    if (authUser?.role?.guard === "ADMIN") {
      return true;
    } else {
      return false;
    }
  } else {
    return false;
  }
};

export const logOut = () => {
  let url = window.location.href;
  const parsedUrl = new URL(url);
  const isLocalhost = parsedUrl.hostname === "localhost";

  // Cookies.remove(constants.ACCESS_TOKEN_HOST);
  // Cookies.remove(constants.REFRESH_TOKEN_HOST);
  Cookies.remove(constants.PROPERTY_ID);
  Cookies.remove(constants.PLAN_ID);
  Cookies.remove(constants.ROOM_ID);
  Cookies.remove(constants.LOCATION_OBJECT);
  // Cookies.remove(constants.Expire_time);

  Cookies.remove(constants.ACCESS_TOKEN_HOST, {
    domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
    path: "/",
  });

  Cookies.remove(constants.REFRESH_TOKEN_HOST, {
    domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
    path: "/",
  });

  Cookies.remove(constants.AUTH_USER_HOST, {
    domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
    path: "/",
  });

  Cookies.remove(constants.ACCESS_TOKEN, {
    domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
    path: "/",
  });

  Cookies.remove(constants.REFRESH_TOKEN, {
    domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
    path: "/",
  });

  Cookies.remove(constants.AUTH_USER, {
    domain: isLocalhost ? "" : import.meta.env.VITE_DOMAIN_PATH,
    path: "/",
  });

  Cookies.remove(constants.AUTH_USER_HOST);
  window.location.href = "/";
};

export const truncateDescriptions = (text: string, wordLimit: number) => {
  if (!text) return "";
  const words = text.split(" ");
  return words.length > wordLimit
    ? words.slice(0, wordLimit).join(" ") + "..."
    : text;
};
