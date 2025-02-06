import { configureStore } from "@reduxjs/toolkit";
import polygonsReducer from "./features/polygonsSlice";

export const makeStore = () => {
  return configureStore({
    reducer: {
      polygons: polygonsReducer,
    },
  });
};

export type AppStore = ReturnType<typeof makeStore>;
export type RootState = ReturnType<AppStore["getState"]>;
export type AppDispatch = AppStore["dispatch"];
