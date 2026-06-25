//files/upload?files
import {
  ApiObject,
  DiscountChangeDataObj,
  DiscountRemoveDataObj,
  DurationalDiscountObj,
} from "../common/interfaces/apiNecessaryInterface.ts";
import ApiService from "./apiService.ts";

export async function getCalendarDiscountRoomCategories(propertyId: number) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/accommodation-units/by-property/${propertyId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllDiscounts(accUnitId: number) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/discounts/accommodation-unit/${accUnitId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function changeDiscountValues(accUnitId: number, data: DiscountChangeDataObj) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/discounts/add-or-update/${accUnitId}`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}
export async function removeDiscountValues(data: DiscountRemoveDataObj) {
  const apiObject: ApiObject = {
    method: "PATCH",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/discounts/remove`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllDurationalDiscountTypes() {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/discounts/discount-duration`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function changeDurationalDiscountValues(data: DurationalDiscountObj, propertyId: number) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/discounts/durational-discount/${propertyId}`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}
