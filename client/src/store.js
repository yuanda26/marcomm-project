import { createStore, applyMiddleware, compose } from "redux";
import thunk from "redux-thunk";
import rootReducer from "./reducers";

const initialState = {};
const middleware = [thunk];

// In development, use the browser's Redux dev tools extension if installed
const enhancers = [];
const isDevelopment = process.env.NODE_ENV === "development";
if (
  isDevelopment &&
  typeof window !== "undefined" &&
  window.__REDUX_DEVTOOLS_EXTENSION__
) {
  enhancers.push(window.__REDUX_DEVTOOLS_EXTENSION__());
}

const store = createStore(
  rootReducer,
  initialState,
  compose(
    applyMiddleware(...middleware),
    ...enhancers
  )
);

export default store;
