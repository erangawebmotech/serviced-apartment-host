import { combineReducers } from "redux";
import loaderReducer from "./loader/reducer";
import loginReducer from "./login/reducer";
import propertyReducer from "./propertyListing/reducer";
import { buttonReducer } from "./disableUploader/reducer";
import profileReducer from "./profile/reducer";

const rootReducer = combineReducers({
  loader: loaderReducer,
  login: loginReducer,
  property: propertyReducer,
  buttonReducer: buttonReducer,
  profileUpdate: profileReducer,
});

export type RootState = ReturnType<typeof rootReducer>;
export default rootReducer;
