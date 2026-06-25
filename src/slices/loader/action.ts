export const IS_LOADER = "IS_LOADER";

export const loaderHandler = (data: { isLoader: boolean; type: number }) => {
  // console.log(data);

  return {
    type: IS_LOADER,
    value: data,
  };
};
