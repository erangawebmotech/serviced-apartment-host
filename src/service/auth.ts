import ApiService from "./apiService";
import {
  ApiObject,
  AppleLoginCredentialsObj,
  FacebookLoginCredentialsObj,
  firstTimeLoginPWResetObj,
  forgetPWResetPWObj,
  GoogleLoginCredentialsObj,
  LoginUserCredentialsObj,
  SignUpUserCredentialsObj,
} from "../common/interfaces/apiNecessaryInterface";

export async function loginService(userCredentials: LoginUserCredentialsObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: false,
    urlencoded: false,
    isWithoutPrefix: false,
    endpoint: "api/v1/web/auth/sign-in/email",
    body: userCredentials,
  };
  return await ApiService.callApi(apiObject);
}

export async function googleLoginService(token: GoogleLoginCredentialsObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: false,
    urlencoded: false,
    isWithoutPrefix: false,
    endpoint: "api/v1/web/auth/sign-in/google",
    body: token,
  };
  return await ApiService.callApi(apiObject);
}

export async function facebookLoginService(token: FacebookLoginCredentialsObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: false,
    urlencoded: false,
    isWithoutPrefix: false,
    endpoint: "api/v1/web/auth/sign-in/facebook",
    body: token,
  };
  return await ApiService.callApi(apiObject);
}

export async function appleLoginService(token: AppleLoginCredentialsObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: false,
    urlencoded: false,
    isWithoutPrefix: false,
    endpoint: "api/v1/web/auth/sign-in/apple",
    body: token,
  };
  return await ApiService.callApi(apiObject);
}

export async function verifyUserToken() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: "api/v1/auth/me",
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function signUpService(data: SignUpUserCredentialsObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: "api/v1/web/auth/sign-up/email",
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function requestOTPInRegister(email: string, OYPType: string, firstName: string, lastName: string) {
  const apiObject: ApiObject = {
    method: "PATCH",
    authentication: true,
    urlencoded: false,
    endpoint: `api/v1/auth/send-otp?email=${email}&sendOTPType=${OYPType}&firstName=${firstName}&lastName=${lastName}`,
    body: email,
  };
  return await ApiService.callApi(apiObject);
}

export async function firstTimePasswordReset(data: firstTimeLoginPWResetObj) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    endpoint: "api/v1/auth/password",
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function renewToken(token: string) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    urlencoded: false,
    endpoint: "auth/refresh",
    body: token,
  };
  return await ApiService.callApi(apiObject);
}

export async function requestOTPInForgetPassword(email: string, OYPType: string) {
  const apiObject: ApiObject = {
    method: "PATCH",
    authentication: true,
    urlencoded: false,
    endpoint: `api/v1/auth/send-otp?email=${email}&sendOTPType=${OYPType}`,
    body: email,
  };
  return await ApiService.callApi(apiObject);
}

export async function OTPValidateInForgetPassword(email: string, otp: string) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    urlencoded: false,
    endpoint: `api/v1/auth/validate-otp?key=${email}&otp=${otp}`,
    body: email,
  };
  return await ApiService.callApi(apiObject);
}
export async function passwordResetInForgetPassword(data: forgetPWResetPWObj) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    urlencoded: false,
    endpoint: `api/v1/auth/password`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

