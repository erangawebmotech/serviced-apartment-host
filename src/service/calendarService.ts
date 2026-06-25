//files/upload?files
import {
  ApiObject,
  BlockCalenderDatesObj,
  CalendarDataObj,
  CalendarPricesPayloadObj,
  GetCalendarPricePayloadObj,
  RoomCategoryPriceChangeCalendarPayloadObj,
  UnblockCalenderDatesObj,
} from "../common/interfaces/apiNecessaryInterface.ts";
import ApiService from "./apiService.ts";

export async function getCalendarDates(data: CalendarDataObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/calender/find-details`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function getCalendarPrices(data: CalendarPricesPayloadObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/calendar-prices/property`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}
export async function getCalendarEventDetails(data: CalendarDataObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/calender/find-summary`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function getCalendarDateAvailability(data: CalendarDataObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/calender/find-availability`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function getCalendarAccommodationUnits(data: CalendarDataObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/accommodation-units/calender`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function blockCalenderDates(data: BlockCalenderDatesObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/calender`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function unblockCalenderDates(data: UnblockCalenderDatesObj) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/calender`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function getCalenderPricesAccordingToDates(
  data: GetCalendarPricePayloadObj
) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/calendar-prices/find-all`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function changeCalendarPricesAccordingToDates(
  data: RoomCategoryPriceChangeCalendarPayloadObj
) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/calendar-prices`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}
