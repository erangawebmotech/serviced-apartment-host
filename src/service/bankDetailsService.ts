import { PropertyListingCreateDataObjectDTO } from "../common/dto/propertyListingCreateDataObjectDTO";
import {
  ApiObject,
  bankDetailsFiltrationObj,
  CreateBankDetailObj,
  icalURLGenerateDataObj,
  ReservationFiltrationObj,
  UpdateBankDetailObj,
} from "../common/interfaces/apiNecessaryInterface";
import ApiService from "./apiService";

export async function getAllBankDetailsOfAuthUser(
  filters: bankDetailsFiltrationObj
) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/bank-accounts/user`,
    body: filters,
  };
  return await ApiService.callApi(apiObject);
}

export async function createNewBankDetail(data: CreateBankDetailObj) {
  const apiObject: ApiObject = {
    method: "POST",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/bank-accounts`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}

export async function updateBankDetail(data: UpdateBankDetailObj) {
  const apiObject: ApiObject = {
    method: "PUT",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/bank-accounts`,
    body: data,
  };
  return await ApiService.callApi(apiObject);
}
export async function deleteBankDetail(bankDetailId: number) {
  const apiObject: ApiObject = {
    method: "DELETE",
    authentication: true,
    isWithoutPrefix: false,
    endpoint: `api/v1/web/bank-accounts/${bankDetailId}`,
    body: null,
  };
  return await ApiService.callApi(apiObject);
}
