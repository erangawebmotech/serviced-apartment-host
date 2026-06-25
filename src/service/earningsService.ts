import { PropertyListingCreateDataObjectDTO } from "../common/dto/propertyListingCreateDataObjectDTO";
import {
  ApiObject,
  EarningsFiltrationObj,
  ReservationFiltrationObj,
} from "../common/interfaces/apiNecessaryInterface";
import ApiService from "./apiService";

export async function getAllEarnings(currentPage: number, pageLimit: number) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/commission-payments/host?page=${currentPage}&perPage=${pageLimit}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllEarningsFiltration(
  data: EarningsFiltrationObj,
  currentPage: number,
  pageLimit: number
) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/commission-payments/host?checkIn=${data.checkin}&checkOut=${data.checkout}&propertyId=${data.propertyId}&paymentType=${data.paymentType}&reservationCode=${data.reservationCode}&earningSummary=${data.earningSummery}&page=${currentPage}&perPage=${pageLimit}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getEarningsSummeryWithFiltration(data: EarningsFiltrationObj) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/commission-payments/host-summary?checkIn=${data.checkin}&checkOut=${data.checkout}&propertyId=${data.propertyId}&paymentType=${data.paymentType}&reservationCode=${data.reservationCode}&earningSummary=${data.earningSummery}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
