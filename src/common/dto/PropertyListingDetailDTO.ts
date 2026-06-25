export class PropertyListingDetailDTO {
  id?: number;
  code?: string;
  name?: string;
  description?: string;
  city?: string;
  floor?: string;
  totalUnitImagesCount?: number;
  cancellationPolicies?: {
    longCancellationPolicy: {
      id: number;
      type: string;
      name: string;
      description: string;
    };
    shortCancellationPolicyId: {
      id: number;
      type: string;
      name: string;
      description: string;
    };
    isRefundAvailable: boolean;
    shortTermSecurity: number;
    longTermSecurity: number;
    nrpRate: number;
  };
  postalCode?: string;
  otherParty?: {
    id: number;
    party?: string;
  };
  lng?: number;
  lat?: number;
  address?: string;
  status?: string;
  allowEntireProperty?: boolean;
  allowIndividualUnit?: boolean;
  allowInstantBooking?: boolean;
  entirePropertyPrices?: {
    maxHeadCount: number | null;
    minBookingDays: number | null;
    rates: {
      id: number;
      headCount: number;
      rate: number;
    }[];
  };
  hasBreakfast?: boolean;
  checkIn?: string;
  checkOut?: string;
  lastMainStep?: string;
  lastSubStep?: string;
  payAtProperty?: boolean;
  priceForEntireProperty?: number;
  monthlyRate?: number;
  propertyHighlights?: {
    id: number
    name: string
    file: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      mediumPath: string;
      largePath: string;
      type: string;
    }
  }[]
  parkingFacility?: {
    id: number;
    type: string;
  };
  plan?: {
    id: number;
    name: string;
  };
  invoiceHeadingType?: string;
  propertyType?: {
    id: number;
    name: string;
    icon: string;
    key: string;
  };
  propertyImages?: {
    isCover?: boolean;
    altTag?: string;
    file?: {
      id?: number;
      originalName?: string;
      originalPath?: string;
      smallPath?: string;
      mediumPath?: string;
      largePath?: string;
      type?: string;
    };
  }[];
  propertyPolicies?: {
    question: {
      id: number;
      question: string;
      answers: {
        id: number;
        label: string;
      };
    };
  }[];
  specialAreas?: {
    id?: number;
    name?: string;
    areaImages?: {
      isCover?: boolean;
      altTag?: string;
      file?: {
        id?: number;
        originalName?: string;
        originalPath?: string;
        smallPath?: string;
        mediumPath?: string;
        largePath?: string;
        type?: string;
      };
    }[];
  }[];
  sharedBathrooms?: {
    id?: number;
    count?: number;
    bathroomType?: {
      id?: number;
      name?: string;
    };
    amenities?: {
      id?: number;
      name?: string;
      file: {
        id: number;
        originalName: string;
        originalPath: string;
        smallPath: string;
        mediumPath: string;
        largePath: string;
        type: string;
      }
    }[];
  }[];
  unitDetails?: PropertyUnitDetails[];
  propertyAmenities?: {
    id: number;
    description: string;
    amenity: {
      id: number;
      name: string;
      file: {
        id: number;
        originalName: string;
        originalPath: string;
        smallPath: string;
        mediumPath: string;
        largePath: string;
        type: string;
      }
    };
  }[];
  newListingDiscount?: number;
  propertyLanguages?: {
    id: number;
    name: string;
    code: string;
  }[];
  unitPrices?: {
    id: number;
    headCount: number;
    price: number;
  }[];
  listingImages?: string;
  createdAt?: string;
  updatedAt?: string;
  propertyOwner?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    countryCode: string;
    file?: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      mediumPath: string;
      largePath: string;
      type: string;
    } | null;
  };

  host?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    contactNo: string;
    countryCode?: string | null;
    file?: {
      id: number;
      originalName: string;
      originalPath: string;
      smallPath: string;
      mediumPath: string;
      largePath: string;
      type: string;
    } | null;
  };

  slug?: string | null;

  isOnlyPropertyOwner?: boolean;
}

export class PropertyUnitDetails {
  id?: number;
  unitCategoryId?: number;
  count?: number;
  editable?: boolean;
  unitId?: number;
  name?: string;
  maxHeadCount?: number;
  isMasterBedRoom?: boolean;
  minBookingDays?: number;
  size?: number;
  status?: string;
  priceForMaxCount?: number;
  monthlyRate?: number;
  unitCategory?: {
    id?: number;
    name?: string;
  };
  beds?: {
    id?: number;
    count?: number;
    bedType?: {
      id?: number;
      name?: string;
    };
  }[];
  unitBathrooms?: {
    id?: number;
    count?: number;
    bathroomType?: {
      id?: number;
      name?: string;
    };
    amenities?: {
      id?: number;
      name?: string;
      file: {
        id: number;
        originalName: string;
        originalPath: string;
        smallPath: string;
        mediumPath: string;
        largePath: string;
        type: string;
      }
    }[];
  }[];
  subUnits?: {
    id?: number;
    name?: string;
  }[];
  unitRates?: {
    id: number;
    headCount: number;
    rate: number;
  }[];
  unitAmenities?: {
    id?: number;
    description?: string;
    amenity?: {
      id?: number;
      name?: string;
      file: {
        id: number;
        originalName: string;
        originalPath: string;
        smallPath: string;
        mediumPath: string;
        largePath: string;
        type: string;
      }
    };
  }[];
  unitHighlights?: {
    id?: number;
    name?: string;
    file?: string;
  }[];
  unitImages?: {
    isCover?: boolean;
    altTag?: string;
    file?: {
      id?: number;
      originalName?: string;
      originalPath?: string;
      smallPath?: string;
      mediumPath?: string;
      largePath?: string;
      type?: string;
    };
  }[];
}
