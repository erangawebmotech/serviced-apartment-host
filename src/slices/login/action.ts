export const IS_LOGGED = "IS_LOGGED";

export const loginHandler = (data: { isLogged: boolean; type: number }) => {
  return {
    type: IS_LOGGED,
    value: data,
  };
};
