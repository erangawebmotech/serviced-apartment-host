import { PropertyListingCreateDataObjectDTO } from "../common/dto/propertyListingCreateDataObjectDTO";
import { ApiObject } from "../common/interfaces/apiNecessaryInterface";
import ApiService from "./apiService";

export async function getPropertyById(propertyId: number) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/properties/${propertyId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function addNewProperty(
  data: PropertyListingCreateDataObjectDTO,
  stepEnum: string,
  propertyId: number | null
) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/properties/${stepEnum}?propertyId=${propertyId}`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function updatePropertyCreateLastMainStep(
  lastStepEnum: string,
  propertyId: number | null
) {
  const apiObject: ApiObject = {
    method: "PATCH",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/properties/last-main-step/${propertyId}?lastMainStep=${lastStepEnum}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function updateProperty(data: PropertyListingCreateDataObjectDTO) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: ``,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function deleteDraftProperty(propertyId: number) {
  const apiObject: ApiObject = {
    method: "DELETE",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/properties/${propertyId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function inactiveProperty(
  propertyId: number,
  data: { status: string }
) {
  const apiObject: ApiObject = {
    method: "PATCH",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/properties/change-status/${propertyId}`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}
