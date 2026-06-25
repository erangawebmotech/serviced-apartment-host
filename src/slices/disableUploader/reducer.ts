import { ENABLE_BUTTON, DISABLE_BUTTON } from "./action";

 interface ButtonState {
    isDisabled: boolean;
}

const initialState: ButtonState = {
    isDisabled: false,
};

 export const buttonReducer = (
    state = initialState,
    action: { type: string }
): ButtonState => {
    switch (action.type) {
        case ENABLE_BUTTON:
            return { ...state, isDisabled: false };
        case DISABLE_BUTTON:
            return { ...state, isDisabled: true };
        default:
            return state;
    }
};
