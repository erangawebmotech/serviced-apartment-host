import { IS_PROFILE_UPDATE } from "./action";

interface ProfileState {
  isUpdate: boolean;
  type: number;
}
interface ProfileAction {
  type: typeof IS_PROFILE_UPDATE;
  value: {
    isUpdate: boolean;
    type: number;
  };
}

const initialState: ProfileState = {
  isUpdate: false,
  type: 0,
};

const profileReducer = (state = initialState,
  action: ProfileAction
): ProfileState => {
  switch (action.type) {
    case IS_PROFILE_UPDATE:
      return {
        ...state,
        isUpdate:
          action.value.isUpdate !== undefined
            ? action.value.isUpdate
            : state.isUpdate,
        type: action.value.type !== undefined ? action.value.type : state.type,
      };
    default:
      return state;
  }
};

export default profileReducer;
