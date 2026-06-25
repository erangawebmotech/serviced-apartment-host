import { ApiObject, ProfileDetailsObj } from "../common/interfaces/apiNecessaryInterface";
import ApiService from "./apiService";

export async function updateProfileDetails(userId: number, data: ProfileDetailsObj) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/users/profile/${userId}`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}
