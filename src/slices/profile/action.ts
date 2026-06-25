export const IS_PROFILE_UPDATE = "IS_PROFILE_UPDATE";

export const profileHandle = (data: { isUpdate: boolean, type: number }) => {
  return {
    type: IS_PROFILE_UPDATE,
    value: data
  };
};