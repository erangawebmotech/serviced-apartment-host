export class PropertyListingCreateDataObjectDTO {
  planId?: number;
  propertyTypeId?: number;
  location?: {
    postalCode: string;
    city: string;
    address: string;
    province: string;
    floor: string;
    mapDetails: any;
  };
  services?: {
    parkingFacilityType: string | null;
    hasBreakfast: boolean | string | null;
    otherPartyId?: number | undefined;
  };
  propertyLanguageIds?: number[];
  propertyPolices?: {
    questionAndAnswers: {
      questionId: number;
      answerId: number | string;
    }[];
    checkIn: string;
    checkOut: string;
  };
  bookingType?: string[];
  specialAreaIds?: number[];
  propertyAmenities?: {
    amenityId: number;
    description: string;
  }[];
  propertyProfile?: {
    name: string;
    description: string;
  };
  sharedBathrooms?: {
    bathroomTypeId: number;
    count: number;
    amenityIds: number[];
  }[];
  priceForEntireProperty?: number;
  propertyHighlightIds?: number[];
  payAtProperty?: boolean;
  cancellationPolicies?: {
    longCancellationPolicyId: number;
    shortCancellationPolicyId: number;
    isRefundAvailable: boolean;
  };
  invoiceHeadingType?: string;
  newPropertyDiscount?: {
    value: number
  }
  unitDetails?: {
    individualUnitDetails?: {
      unitCategoryId?: null | number; // or null
      count?: number;
      unitId?: null | number; //null or unitId if null then create new accomdation unit else update accomdation unut
      maxHeadCount?: number;
      minBookingDays?: number;
      size?: number;
      beds?: {
        bedTypeId?: number;
        count?: number;
      }[];
      unitBathrooms?: {
        unitId?: number;
        bathrooms: {
          bathroomTypeId: number;
          count: number;
          amenityIds: number[];
        }[];
      };
      unitProfile?: {
        unitId: number;
        name: string;
        subUnitsNames: string[];
      };
      unitAmenities?: {
        unitId: number;
        amenities: {
          amenityId: number;
          description: string;
        }[];
        highlightIds: number[];
      };
      unitPriceForMaxCount?: {
        unitId: number;
        priceForMaxCount: number;
      };
      unitRates?: {
        unitId: number;
        rates: {
          headCount: number;
          rate: number;
        }[];
      };
    };
    entirePropertyUnitDetails?: {
      count: number;
      entirePropertyUnitDetailsObject: {
        unitId: null | number;
        beds?: {
          bedTypeId?: number;
          count?: number;
        }[];
        attachedFullBathroomCount: number | null;
        attachedHalfBathroomCount: number | null;
      }[];

      sharedFullBathroomCount: number | null;
      sharedHalfBathroomCount: number | null;
    };
  };
  images?: {
    propertyImages: {
      fileId: number;
      isCover: boolean;
    }[];
    areaImages: {
      propertyAreaId: number;
      fileId: number;
      isCover: boolean;
    }[];
    unitImages?: {
      unitId: number;
      images: [
        {
          fileId: number;
          isCover: boolean;
        },
        {
          fileId: number;
          isCover: boolean;
        }
      ];
    }[];
  };
  entirePropertyPrices?: {
    minBookingDays: number,
    maxHeadCount: number,
    rates: {
      headCount: number;
      rate: number;
    }[] | [],
  }
}
