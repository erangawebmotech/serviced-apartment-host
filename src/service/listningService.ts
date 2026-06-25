import { ApiObject } from "../common/interfaces/apiNecessaryInterface";
import ApiService from "./apiService";

export async function getAllPropertyListToDropdown() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/properties/calender`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllPropertyListFiltration(
  propertyId?: any,
  propertyName?: string,
  propertyStatusValue?: string,
  districtValue?: string,
  citiesValue?: string,
  startDate?: any,
  endDate?: any,
  page?: number
) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/properties/user?propertyTypeId=${propertyId}&propertyName=${propertyName}&propertyStatus=${propertyStatusValue}&districtId=${districtValue}&cityId=${citiesValue}&createdAtStartDate=${startDate}&createdAtEndDate=${endDate}&page=${page}&perPage=9`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

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

export async function getPropertyType() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/property-types`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function findAllLocationCategory() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/locations/categories?limitArea=DISTRICT`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
