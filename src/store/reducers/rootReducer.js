import coinReducer from "./coinReducer";
import exchangeReducer from "./exchangeReducer";
import { combineReducers } from "redux";

const rootReducer = combineReducers({
  coin: coinReducer,
  exchange: exchangeReducer
});

export default rootReducer;
