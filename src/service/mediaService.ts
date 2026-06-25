//files/upload?files
import {ApiObject} from "../common/interfaces/apiNecessaryInterface.ts";
import ApiService from "./apiService.ts";

export async function uploadImages(data:any) {
    const apiObject: ApiObject = {
        method: "POST",
        authentication: true,
        isWithoutPrefix: false,
        endpoint: `api/v1/files/upload`,
        multipart:true,
        body: data,
    };
    return await ApiService.callApi(apiObject);
}
