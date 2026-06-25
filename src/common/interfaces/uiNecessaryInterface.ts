import { DiscountTypeEnum } from "../enums/discountTypeEnum";

export interface DropdownObj {
  value: string | number | boolean;
  label: string | number;
}
export interface DropdownObjTwo {
  value: number;
  label: JSX.Element;
}

export interface DropdownObjThree {
  value: number;
  label: string;
  customLabel: JSX.Element;
}

export interface BedTypeDetails {
  id: string;
  name: string;
}

export interface PropertyTypeDetailsObject {
  id: number;
  icon: string;
  name: string;
  key: string;
}

export interface LanguagesDetailsObject {
  id: number;
  code: string;
  name: string;
}

export interface DescribeApartmentItemsObj {
  id: string;
  icon: string;
  name: string;
}

export interface HighlightItemsObj {
  id: number;
  icon: string;
  name: string;
}

export interface QuestionDetailsObject {
  id: number;
  question: string;
  status: string;
  answers: {
    id: number;
    label: string;
  }[];
}

export interface SpecialAreaDetailsObject {
  id: number;
  name: string;
}

export interface SpecialAreaAmenitiesObject {
  amenityCategory: {
    id: number;
    name: string;
    amenities: AmenityObject[];
  };
}

export interface AmenityObject {
  id: number;
  name: string;
  file: {
    id: number;
    originalName: string;
    originalPath: string;
    smallPath: string;
    largePath: string;
    mediumPath: string;
  };
}

export interface BathroomDetailsObject {
  id: number;
  name: string;
}

export interface SelectedBathroomDetailsObject {
  bathroomTypeId: number;
  count: number;
  amenityIds: number[];
}

export interface CancellationPolicyDetailsObject {
  type: string;
  cancellationPolicies: CancellationPolicies[];
}

export interface CancellationPolicies {
  id: number;
  name: string;
  description: string;
  type?: string;
}

export interface BedTypeDataObject {
  id: number;
  name: string;
  count: number;
}
export interface SelectedBedTypeDataObject {
  bedTypeId: number;
  count: number;
}

export interface RoomDetailsDataObject {
  bedDetails: SelectedBedTypeDataObject[];
  bathroomType: string;
  unitId: number | null;
  editable: boolean;
  isMasterBedRoom: boolean;
}

export interface SelectedBathroomDetailsObject {
  isSelected: boolean;
  bathroomTypeId: number;
  count: number;
  amenityIds: number[];
}

export interface propertyImage {
  id?: number;
  isCover?: boolean;
  altTag?: string;
  file?: {
    id: number;
    originalName: string;
    originalPath: string;
    smallPath: string;
    mediumPath: string;
    largePath: string;
    type: string;
  };
  url?: string;
  thumbUrl?: string;
}

export interface unitDetailsImage {
  unitId?: number;
  images?: {
    id?: number;
    isCover?: boolean;
    altTag?: string;
    file?: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      mediumPath: string;
      largePath: string;
      type: string;
    };
    url?: string;
    thumbUrl?: string;
  }[];

  id?: number;
  isCover?: boolean;
  altTag?: string;
  file?: {
    id: number;
    originalName: string;
    originalPath: string;
    smallPath: string;
    mediumPath: string;
    largePath: string;
    type: string;
  };
  url?: string;
  thumbUrl?: string;
}

export interface PropertyImagesRapterObj {
  name: string;
  id: number;
}

export interface PriceRatePlan {
  unitId: number | undefined;
  rates: {
    headCount: number;
    rate: number;
  }[];
}
export interface PriceRatePlanForEntireProperty {
  unitId?: number;
  rates: {
    headCount: number;
    rate: number;
  }[]
}

export interface GuestUseInRoomDataObject {
  amenities: {
    amenityId: number;
    description: string;
  }[];
  highlightIds: number[];
}

export interface BathRoomDataObject {
  bathroomTypeId: number;
  count: number;
  amenityIds: string[];
}
export interface UnitSubUnitNameDataObject {
  name: string;
  subUnitsNames: string[];
}

export interface PricePerNightDataObject {
  priceForMaxCount: number;
  monthlyRate: number;
}

export interface PriceRatePlanDataObject {
  rates: { headCount: number; rate: number }[];
}

export interface UnitDetailsDataObject {
  unitCategoryId: number | null;
  count: number;
  unitId: number | null;
  maxHeadCount: number;
  minBookingDays: number;
  size: number;
  beds: { bedTypeId: number; count: number }[];
  unitProfile: UnitSubUnitNameDataObject;
}

export interface HomeStayOptionDetailsObject {
  id: number;
  icon: string;
  party: string;
}

export interface SelectedCalenderDateObject {
  startDate: string;
  endDate: string;
}
export interface SelectedCalenderDateEventDataObject {
  blockedSummary: BlockedSummaryEventDataObject;
  reservationSummary: ReservationSummaryEventDataObject;
  icalReservationSummary: ICalReservationSummaryEventDataObject;
  maintenanceSummary: MaintenanceSummaryEventDataObject;
  discountSummary: DiscountSummaryEventDataObject;
}

export interface BlockedSummaryEventDataObject {
  propertyId: number;
  allowEntireProperty: boolean;
  allowIndividualUnit: boolean;
  name: string;
  propertyType: {
    type: string;
  };
  owner: {
    id: number;
    firstName: string;
    lastName: string;
  };
  summary: {
    dateRange: {
      startDate: string;
      endDate: string;
    }[];
    type: string;
    count: number;
    accommodationUnis: {
      id: number;
      name: string;
      events: BlockedSummaryEventObject[];
    }[];
    entireProperDetails: {
      date: string;
      reason: string;
    }[];
  };
}

export interface BlockedSummaryEventObject {
  date: string;
  subUnitDetailsDTOS: BlockedSummaryEventPropertyObject[];
}
export interface BlockedSummaryEventPropertyObject {
  id: number;
  name: string;
  reason: string;
}

export interface ReservationSummaryEventDataObject {
  propertyId: number;
  name: string;
  propertyType: {
    type: string;
  };
  owner: {
    id: number;
    firstName: string;
    lastName: string;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
    email: string;
    countryCode: string;
    contactNo: string;
  };
  summary: {
    dateRange: {
      startDate: string;
      endDate: string;
    }[];
    type: string;
    count: number;
    events: ReservationSummaryEventObject[];
  };
}

export interface ReservationSummaryEventObject {
  checkInDate: string;
  checkOutDate: string;
  isEntireProperty: boolean;
  reservationNumber: string;
  totalAmount: number;
  totalRoomCount: number;
  guestContactNumber: string;
  guestEmail: string;
  guestFirstName: string;
  guestLastName: string;
  guestCountryCode: string;
  reservedUser: {
    id: number;
    firstName: string;
    lastName: string;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
    email: string;
    countryCode: string;
    contactNo: string;
  };
  roomDetails: {
    name: string;
    maxHeadCount: number;
    roomCount: number;
  }[];
  numberOfGuests: number;
  numberOfRooms: number;
  status: string;
  specialRequest: string;
  paymentType: string;
}

export interface ICalReservationSummaryEventDataObject {
  propertyId: number;
  name: string;
  propertyType: {
    type: string;
  };
  owner: {
    id: number;
    firstName: string;
    lastName: string;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
    email: string;
    countryCode: string;
    contactNo: string;
  };
  summary: {
    dateRange: {
      startDate: string;
      endDate: string;
    }[];
    type: string;
    count: number;
    events: ICalReservationSummaryEventObject[];
  };
}

export interface ICalReservationSummaryEventObject {
  checkInDate: string;
  checkOutDate: string;
  platform: string;
}

export interface MaintenanceSummaryEventDataObject {
  propertyId: number;
  name: string;
  propertyType: {
    type: string;
  };
  owner: {
    id: number;
    firstName: string;
    lastName: string;
  };
  summary: {
    dateRange: {
      startDate: string;
      endDate: string;
    }[];
    type: string;
    count: 0;
    events: MaintenanceSummaryEventObject[];
  };
}

export interface MaintenanceSummaryEventObject {
  date: string;
  properties: MaintenanceSummaryEventPropertyObject[];
}
export interface MaintenanceSummaryEventPropertyObject {
  id: number;
  name: string;
  reason: string;
  status: string;
}

export interface DiscountSummaryEventDataObject {
  propertyId: number;
  name: string;
  propertyType: {
    type: string;
  };
  owner: {
    id: number;
    firstName: string;
    lastName: string;
  };
  summary: {
    dateRange: {
      startDate: string;
      endDate: string;
    }[];
    type: string;
    count: 0;
    events: DiscountSummaryEventObject[];
  };
}

export interface DiscountSummaryEventObject {
  checkInDate: string;
  checkOutDate: string;
  reservationNumber: string;
  totalAmount: number;
  reservationOwner: {
    id: number;
    firstName: string;
    lastName: string;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
    email: string;
    countryCode: string;
    contactNo: string;
  };
  numberOfGuests: number;
  numberOfRooms: number;
  status: string;
  specialRequest: string;
  entireProperty: boolean;
  paymentType: string;
}

export interface CalendarDateAvailabilityObj {
  propertyId: number;
  name: string;
  message: string;
  propertyType: {
    type: string;
  };
  owner: {
    id: number;
    firstName: string;
    lastName: string;
  };
  availability: {
    title: string;
    description: string;
    unitDetails: string[];
  };
  entirePropertyAvailable: boolean;
}

export interface CalendarDateAccommodationUnitsObj {
  id: number;
  name: string;
  subUnits: {
    id: number;
    name: string;
    available: boolean;
  }[];
}

export interface CalendarAccommodationUnitsListObj {
  value: number;
  label: string;
  subUnits: {
    id: number;
    name: string;
    available: boolean;
  }[];
}

export interface AccommodationUnitSubUnitListObj {
  value: number;
  label: string;
  disabled: boolean;
}

export interface ReservationCardDetailsObj {
  id: number;
  checkIn: string;
  checkOut: string;
  paymentStatus: string;
  paymentType: string;
  code: string;
  property: {
    id: number;
    name: string;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
    plan: {
      id: number;
      name: string;
    };
    owner: {
      id: number;
      firstName: string;
      lastName: string;
      file: {
        id: number;
        originalName: string;
        originalPath: string;
        smallPath: string;
        largePath: string;
        mediumPath: string;
      };
      countryCode: string;
      contactNo: string;
    };
    description: string;
  };
  reservationStatus: string;
}

export interface ReservationAllDetailsObj {
  id: number;
  checkIn: string;
  checkOut: string;
  totalGuest: number;
  adult: number;
  child: number;
  infant: number;
  pet: number;
  subTotal: number;
  totalDiscount: number;
  netTotal: number;
  commissionRate: number;
  ownerCommissionAmount: number;
  commissionAmount: number;
  securityDeposit: number;
  code: string;
  specialRequest: string;
  contactDetails: {
    firstName: string;
    lastName: string;
    countryCode: string;
    contactNo: string;
    email: string;
  };
  reservedUser: {
    id: number;
    firstName: string;
    lastName: string;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
    countryCode: string;
    contactNo: string;
  };
  nrpEnabled: boolean;
  isOnlyPropertyOwner: boolean;
  status: string;
  property: {
    id: number;
    code: string;
    name: string;
    payAtProperty: boolean;
    address: string;
    city: string;
    floor: null | string;
    allowEntireProperty: boolean;
    allowIndividualUnit: boolean;
    slug: string;
    propertyType: string;
    allowInstantBooking: boolean;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
    plan: {
      id: number;
      name: string;
    };
    propertyOwner: {
      id: number;
      firstName: string;
      lastName: string;
      file: {
        id: number;
        originalName: string;
        originalPath: string;
        smallPath: string;
        largePath: string;
        mediumPath: string;
      };
      countryCode: string;
      contactNo: string;
    };
    host: {
      id: number;
      firstName: string;
      lastName: string;
      file: {
        id: number;
        originalName: string;
        originalPath: string;
        smallPath: string;
        largePath: string;
        mediumPath: string;
      },
      countryCode: string;
      contactNo: string;
    }
    description: string;
  };
  roomCount: number;
  roomDetails: {
    name: string;
    maxHeadCount: number;
    roomCount: number;
    unitPrice: number;
  }[];
  paymentType: string;
  paymentStatus: string;
  reservationTimelines: {
    reason: string;
    createdAt: string;
    status: string;
  }[];
  paymentsTimeLines: {
    reason: string;
    createdAt: string;
    status: string;
  }[];
  reservationPayments: {}[];
  cancellationPolicy: {
    name: string;
    description: string;
  };
  entireProperty: boolean;
}

export interface DiscountDetailsObj {
  discount: {
    id: number;
    name: string;
    description: string;
    startDate: string;
    endDate: string;
    applicationType: null;
    discountType: DiscountTypeEnum;
    calculationMethod: string;
    value: number;
    hourCount: number;
    file: null;
    dateEditable: boolean;
    valueEditable: boolean;
    durationDetails: {
      value: number,
      days: number,
      discountDurationId: number,
      propertyDiscountId: number
    }[]
  };
  alreadyApplied: boolean;
}

export interface EarningsDetailsObj {
  property: {
    id: number;
    name: string;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
  };
  checkIn: string;
  checkOut: string;
  commissionRate: number;
  netTotal: number;
  ownerCommissionAmount: number;
  reservationStatus: string;
  settlementStatus: boolean;
  settlementDate: string;
  referenceNumber: string;
  paymentType: string;
  reservationPaymentStatus: string;
}

export interface EarningsTableDataObj {
  propertyImage: string;
  propertyName: JSX.Element;
  checkingCheckoutDateDate: JSX.Element;
  // checkoutDate: string;
  paymentStatus: string;
  reservationStatus: string;
  paymentType: string;
  settlementStatus: boolean;
  settlementDate: string;
  amount: number;
  commotion: number;
  refNo: string;
  actions: JSX.Element;
}

export interface IcalPropertyDetailsObj {
  property: IcalObjPropertyDetailsObj;
  icalendars: IcalObjICalendarsObj[];
  accommodationUnits: IcalObjAccommodationUnitsObj[];
}

export interface IcalObjPropertyDetailsObj {
  id: number;
  code: string;
  name: string;
  file: {
    id: number;
    originalName: string;
    originalPath: string;
    smallPath: string;
    largePath: string;
    mediumPath: string;
  };
  description: string;
  floor: string | null;
  postalCode: string;
  address: string;
  city: string;
  slug: string;
  propertyType: string;
  allowIndividualUnit: boolean;
  allowEntireProperty: boolean;
  propertyOwner: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    countryCode: string;
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      largePath: string;
      mediumPath: string;
    };
  }
}

export interface IcalObjAccommodationUnitsObj {
  id: number;
  name: string;
  file: {
    id: number;
    originalName: string;
    originalPath: string;
    smallPath: string;
    largePath: string;
    mediumPath: string;
  };
  subUnits: IcalObjSubUnitsObj[];
}

export interface IcalObjSubUnitsObj {
  id: number;
  name: string;
  icalendars: IcalObjICalendarsObj[];
}

export interface IcalObjICalendarsObj {
  id: number;
  url: string;
  platform: string;
}

export interface ReservationSummeryDetails {
  key: string;
  label: string;
  value: string;
}

export interface EarningsSummeryDetails {
  key: string;
  label: string;
  value: number;
}

export interface EarningsSummeryDataObj {
  totalCancelledPrice: number;
  totalEarnedPrice: number;
  totalPaidPrice: number;
  totalPotential: number;
  totalReservationCount: number;
  totalUpcomingPrice: number;
}

export interface authUserDetailObj {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hasHost: boolean;
  countryCode: string;
  contactNo: string;
  lastLoggedAt: string;
  status: string;
  role: { id: number; name: string; status: string; guard: string };
  file: {
    id: number,
    originalName: string,
    originalPath: string,
    smallPath: string,
    largePath: string,
    mediumPath: string
  };
  permissions: string[];
}

export interface authUserDetailObjTwo {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  hasHost: boolean;
  countryCode: string;
  contactNo: string;
  lastLoggedAt: string;
  status: string;
  role: {
    id: number;
    name: string;
    status: string;
    guard: string;
  };
  file: {
    id: number;
    originalName: string;
    originalPath: string;
    smallPath: string;
    largePath: string;
    mediumPath: string;
  };
  whatsappContactNo: string | null,
  isTempPwdRest: boolean,
  createdAt: string,
  reservationCount: number,
  propertyCount: number,
  source: string

}

export interface BankDetailsObj {
  id: number;
  bankName: string;
  branch: string;
  accountNumber: string;
  accountHolderName: string;
  status: string;
}

export type PrivacyStatementProps = {
  title: string;
  description: string;
  subDetails: string[];
  additionalDetails: string | null;
};

export type TermsAndConditionsProps = {
  title: string;
  description: string;
  subDetails: { title: string; description: string }[];
  additionalDetails: string | null;
};

export interface FileUploadObject {
  id: number | null,
  largePath: string;
  mediumPath: string;
  originalName: string;
  originalPath: string;
  smallPath: string;
}

export interface PropertyPolicy {
  question: {
    id: number;
    question: string;
    answers: {
      id: number;
      label: string;
    };
  }

}