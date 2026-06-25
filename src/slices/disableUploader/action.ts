// Action Types
export const ENABLE_BUTTON = "button/ENABLE";
export const DISABLE_BUTTON = "button/DISABLE";

 export const enableButton = () => ({
    type: ENABLE_BUTTON,
});

export const disableButton = () => ({
    type: DISABLE_BUTTON,
});
