import { IS_LOADER } from "./action";

interface LoaderState {
  isLoader: boolean;
  type: number;
}
interface LoaderAction {
  type: typeof IS_LOADER;
  value: {
    isLoader: boolean;
    type: number;
  };
}

const initialState: LoaderState = {
  isLoader: false,
  type: 0,
};

const loaderReducer = (
  state = initialState,
  action: LoaderAction
): LoaderState => {
  switch (action.type) {
    case IS_LOADER:
      return {
        ...state,
        isLoader:
          action.value.isLoader !== undefined
            ? action.value.isLoader
            : state.isLoader,
        type: action.value.type !== undefined ? action.value.type : state.type,
      };
    default:
      return state;
  }
};

export default loaderReducer;
