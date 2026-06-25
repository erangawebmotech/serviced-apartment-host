export interface ApiObject {
  method: "GET" | "POST" | "PUT" | "PATCH" | "DELETE";
  authentication?: boolean;
  urlencoded?: boolean;
  arrayBufferType?: boolean;
  multipart?: boolean;
  isWithoutPrefix?: boolean;
  endpoint: string;
  body?: any;
  state?: string;
  isBasicAuth?: boolean;
}

//================login api necessary interfaces=====================================

export interface LoginUserCredentialsObj {
  email: string;
  password: string;
}
//================google login api necessary interfaces=====================================

export interface GoogleLoginCredentialsObj {
  accessToken: string;
}
//================facebook login api necessary interfaces=====================================

export interface FacebookLoginCredentialsObj {
  access_token: string;
}
//================apple login api necessary interfaces=====================================

export interface AppleLoginCredentialsObj {
  identityToken: string;
}
//================signUp api necessary interfaces=====================================

export interface SignUpUserCredentialsObj {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  otp: string;
  countryCode: string;
  contactNo: string;
  source: string;
}

//================first time login reset pw api necessary interfaces=====================================

export interface firstTimeLoginPWResetObj {
  email: string;
  oldPassword: string;
  newPassword: string;
  passwordActionType: string;
}

//================forget password reset pw api necessary interfaces=====================================

export interface forgetPWResetPWObj {
  newPassword: string
  email: string
  otp: string
  passwordActionType: string
}
//================inquiry api necessary interfaces=====================================

export interface inquiryDataObj {
  planId?: number;
  name: string;
  email: string;
  links: string[];
  contactNo: string;
  location: string;
  description: string;
  countryCode: string;
  customerId: number;
}

export interface CalendarDataObj {
  propertyId: number;
  dateRanges: {
    startDate: string;
    endDate: string;
  }[];
}

export interface CalendarPricesPayloadObj {
  propertyId: number;
  startDate: string;
  endDate: string;
}

export interface BlockCalenderDatesObj {
  subUnitIds: number[];
  isEntireProperty: boolean;
  propertyId: number;
  type: string;
  reason: string;
  dateRanges: {
    startDate: string;
    endDate: string;
  }[];
}

export interface UnblockCalenderDatesObj {
  propertyId: number;
  isEntireProperty: boolean;
  dateRange:
  | null
  | {
    startDate: string;
    endDate: string;
  }[];
  unitDetails:
  | null
  | {
    subUnitId: number;
    dateRanges: {
      startDate: string;
      endDate: string;
    }[];
  }[];
  type: string;
}

export interface BlockCalenderDatesObj {
  subUnitIds: number[];
  isEntireProperty: boolean;
  propertyId: number;
  type: string;
  reason: string;
  dateRanges: {
    startDate: string;
    endDate: string;
  }[];
}

export interface ReservationFiltrationObj {
  propertyId: number | string;
  reservationCode: string;
  reservationSummary: string;
  checkin: string;
  checkout: string;
  paymentStatus: string;
  reviewStatus: string | boolean;
  reservationStatus: string;
}

export interface GetCalendarPricePayloadObj {
  accommodationUnitId: number;
  dateRange: {
    startDate: string;
    endDate: string;
  }[];
}

export interface RoomCategoryPriceChangeCalendarPayloadObj {
  accommodationUnitId: number;
  priceDetails: {
    price: number;
    dateRange: {
      startDate: string;
      endDate: string;
    }[];
  };
}

export interface EarningsFiltrationObj {
  propertyId: number | string;
  reservationCode: string;
  earningSummery: string;
  checkin: string;
  checkout: string;
  paymentStatus: string;
  paymentType: string;
  settlementStatus: string;
}

export interface DiscountChangeDataObj {
  discountId: number;
  startDate?: string;
  endDate?: string;
  value: number;
  hourCount?: number | undefined;
}
export interface DiscountRemoveDataObj {
  discountId: number;
  accommodationUnitId: number;
}

export interface icalURLGenerateDataObj {
  propertyId: number;
  accommodationUnitId?: number | string;
  subUnitId?: number | string;
  isEntireProperty: boolean;
  url?: string;
  platform?: string;
}

export interface bankDetailsFiltrationObj {
  bankName: null | string;
  branch: null | string;
  accountNumber: null | string;
  accountHolderName: null | string;
  status: null | string;
  page: null | string;
  perPage: null | string;
}

export interface CreateBankDetailObj {
  userId: number;
  bankName: string;
  branch: string;
  accountNumber: string;
  accountHolderName: string;
}
export interface UpdateBankDetailObj {
  userId: number;
  bankName: string;
  branch: string;
  accountNumber: string;
  accountHolderName: string;
  bankAccountId: number;
  status: string;
}

export interface ProfileDetailsObj {
  firstName: string;
  lastName: string;
  countryCode: string;
  contactNo: string;
  fileId: number | null | undefined;
}

export interface DurationalDiscountObj {
  discountId: number,
  durationDetails: {
    propertyDiscountId: number | null,
    discountDurationId: number,
    value: number,
  }[]
}
