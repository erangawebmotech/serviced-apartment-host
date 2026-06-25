import { PropertyListingCreateDataObjectDTO } from "../common/dto/propertyListingCreateDataObjectDTO";
import {
  ApiObject,
  icalURLGenerateDataObj,
  ReservationFiltrationObj,
} from "../common/interfaces/apiNecessaryInterface";
import ApiService from "./apiService";

export async function getAllIcalDetailsByPropertyId(propertyId: number) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/icalendars/find-all/${propertyId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function generateIcalURL(data: icalURLGenerateDataObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/icalendars/generate`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function deleteIcalURL(icalId: number) {
  const apiObject: ApiObject = {
    method: "DELETE",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/icalendars/${icalId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
