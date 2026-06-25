import {
  ApiObject,
  inquiryDataObj,
} from "../common/interfaces/apiNecessaryInterface";
import ApiService from "./apiService";

export async function getAllPropertyTypes() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/property-types`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
export async function getAllLanguages() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/languages`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllQuestions() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/questions`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllSpecialAres() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/special-areas`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllAmenities() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/amenities/with-categories`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
export async function getAllAmenitiesSpecialAresWise(specialAreas: number[]) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/amenities/special-areas`,
    body: specialAreas,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllSharedBathrooms() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/bathroom-types/shared`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllBedTypes() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/bed-room-types`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllBedRoomType() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/unit-categories`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAmenitiesDetailsByEnum(data: any) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/amenities/categories`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function deleteUnitDetailById(id: number) {
  const apiObject: ApiObject = {
    method: "DELETE",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/accommodation-units/${id}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
export async function propertyHighlight() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/highlights`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllBathroomDetails() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/bathroom-types`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
export async function getAllNonSharedBathroomDetails() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/bathroom-types/other`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllCancellationPolicies() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/cancellation-policies`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function generateGPTPropertyDescription(
  propertyId: number,
  propertyName: string
) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/gpt/generate-property-description/${propertyId}?name=${propertyName}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllPlanDetails() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/plans`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function checkPlan() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/properties/host/listed-properties/plan-check`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getPropertyTypes() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/property-types`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}



export async function sendInquiry(data: inquiryDataObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/inquiries`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllHomeStayOptions() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/other-parties`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
