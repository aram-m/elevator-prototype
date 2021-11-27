import { configureStore } from "@reduxjs/toolkit";
import { combineEpics, createEpicMiddleware } from "redux-observable";
import elevatorReducer from "../features/elevator/elevatorSlice";
import elevatorEpic from "../features/elevator/elavatorEpic";
import { mapElevatorEventsToActions } from "../features/elevator/elevatorsApiEventsToActionsTransformer";
import { ElevatorApiService } from "../features/elevator/elevatorAPI";

const ElevatorAPI = ElevatorApiService.init();
const epicMiddleware = createEpicMiddleware({
  dependencies: {
    ElevatorAPI,
  },
});

export const rootEpic = combineEpics(elevatorEpic);

export const store = configureStore({
  reducer: {
    elevator: elevatorReducer,
  },
  middleware: [epicMiddleware],
});

epicMiddleware.run(rootEpic);
mapElevatorEventsToActions(store);

export type AppDispatch = typeof store.dispatch;
export type RootState = ReturnType<typeof store.getState>;
export default store;
