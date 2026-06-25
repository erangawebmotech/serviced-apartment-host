import { PropertyListingCreateDataObjectDTO } from "../common/dto/propertyListingCreateDataObjectDTO";
import {
  ApiObject,
  ReservationFiltrationObj,
} from "../common/interfaces/apiNecessaryInterface";
import ApiService from "./apiService";

export async function getAllReservations(currentPage: number) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/reservations/host?page=${currentPage}&perPage=${10}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getReservationById(reservationId: number) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/reservations/${reservationId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getReservationByReservationCode(reservationCode: string) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/reservations/host/find-by-code?code=${reservationCode}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function changeReservationStatus(
  reservationId: number,
  data: {
    status: string;
    reason: string;
  }
) {
  const apiObject: ApiObject = {
    method: "PATCH",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/reservations/change-status/${reservationId}`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function markReservationAsPaid(reservationId: number) {
  const apiObject: ApiObject = {
    method: "PATCH",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/reservation-payments/mark-as-paid/${reservationId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
export async function changePaymentType({ paymentType, reservationId }: { paymentType: string, reservationId: number }) {
  const apiObject: ApiObject = {
    method: "PATCH",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/reservations/change-payment-type/${reservationId}?paymentType=${paymentType}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getAllReservationsFiltration(
  data: ReservationFiltrationObj,
  currentPage: number
) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/reservations/host?checkIn=${data.checkin}&checkOut=${data.checkout
      }&propertyId=${data.propertyId}&reservationStatus=${data.reservationStatus
      }&paymentStatus=${data.paymentStatus}&pendingReview=${data.reviewStatus}&reservationCode=${data.reservationCode
      }&reservationSummary=${data.reservationSummary
      }&page=${currentPage}&perPage=${10}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}

export async function getReservationsSummeryWithFiltration(
  data: ReservationFiltrationObj
) {
  const apiObject: ApiObject = {
    method: "GET",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/reservations/host-summary?checkIn=${data.checkin}&checkOut=${data.checkout}&propertyId=${data.propertyId}&reservationStatus=${data.reservationStatus}&paymentStatus=${data.paymentStatus}&pendingReview=${data.reviewStatus}&reservationCode=${data.reservationCode}&reservationSummary=${data.reservationSummary}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
