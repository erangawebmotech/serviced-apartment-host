import { IS_LOGGED } from "./action";

interface IsLoggedState {
  isLogged: boolean;
  type: number;
}

interface IsLoggedAction {
  type: typeof IS_LOGGED;
  value: {
    isLogged: boolean;
    type: number;
  };
}

const initialState: IsLoggedState = {
  isLogged: false,
  type: 0,
};

const loginReducer = (
  state = initialState,
  action: IsLoggedAction
): IsLoggedState => {
  switch (action.type) {
    case IS_LOGGED:
      return {
        ...state,
        isLogged:
          action.value.isLogged !== undefined
            ? action.value.isLogged
            : state.isLogged,
        type: action.value.type !== undefined ? action.value.type : state.type,
      };
    default:
      return state;
  }
};

export default loginReducer;
