export const IS_UNIT_DETAILS_SET = "IS_UNIT_DETAILS_SET";

export const unitDetailsHandler = (data: {
  guestCount?: number;
  unitPrice?: number;
  isPropertyTypeRoomOrHomeStay?: boolean;
}) => {
  return {
    type: IS_UNIT_DETAILS_SET,
    value: data,
  };
};
