import { IS_UNIT_DETAILS_SET } from "./action";

interface UnitDetailsState {
  guestCount?: number;
  unitPrice?: number;
  isPropertyTypeRoomOrHomeStay?: boolean;
  type: string;
}
interface UnitDetailsAction {
  value: {
    guestCount?: number;
    unitPrice?: number;
    isPropertyTypeRoomOrHomeStay?: boolean;
  };
  type: string;
}

const initialState: UnitDetailsState = {
  guestCount: 0,
  unitPrice: 0,
  isPropertyTypeRoomOrHomeStay: false,
  type: "",
};

const propertyReducer = (
  state = initialState,
  action: UnitDetailsAction
): UnitDetailsState => {
  switch (action.type) {
    case IS_UNIT_DETAILS_SET:
      return {
        ...state,
        guestCount:
          action.value.guestCount !== undefined
            ? action.value.guestCount
            : state.guestCount,
        unitPrice:
          action.value.unitPrice !== undefined
            ? action.value.unitPrice
            : state.unitPrice,
        isPropertyTypeRoomOrHomeStay:
          action.value.isPropertyTypeRoomOrHomeStay !== undefined
            ? action.value.isPropertyTypeRoomOrHomeStay
            : state.isPropertyTypeRoomOrHomeStay,
        type: action.type !== undefined ? action.type : state.type,
      };
    default:
      return state;
  }
};

export default propertyReducer;
