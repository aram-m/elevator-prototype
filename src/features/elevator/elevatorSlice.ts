import { createSlice } from "@reduxjs/toolkit";
import { RootState } from "../../app/store";
import { DIRECTIONS } from "./interfaces";
import * as ElevatorActions from "./elevatorActions";

export const elevatorSliceName = "elevator";

export interface ElevatorState {
  userCurrentFloor: number;
  userSelectedFloor: number | null;
  elevatorCurrentFloor: number;
  direction: DIRECTIONS;
  error: null | string;
}

export const initialState: ElevatorState = {
  userCurrentFloor: 2,
  userSelectedFloor: null,
  elevatorCurrentFloor: 1,
  direction: DIRECTIONS.NONE,
  error: null,
};

export const elevatorSlice = createSlice({
  name: elevatorSliceName,
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(
        ElevatorActions.getCurrentDirectionSuccess,
        (state, { payload: { direction } }) => ({
          ...state,
          direction,
        })
      )
      .addCase(
        ElevatorActions.cabinButtonPressed,
        (state, { payload: { userSelectedFloor } }) => ({
          ...state,
          userSelectedFloor,
        })
      )
      .addCase(
        ElevatorActions.getCurrentFloorSuccess,
        (state, { payload: { elevatorCurrentFloor } }) => ({
          ...state,
          elevatorCurrentFloor,
        })
      )
      .addCase(ElevatorActions.stopAndOpenDoorsSuccess, (state) => ({
        ...state,
        elevatorCurrentFloor: state.userSelectedFloor
          ? state.userCurrentFloor
          : state.elevatorCurrentFloor,
        direction: DIRECTIONS.NONE,
      }))
      .addCase(ElevatorActions.moveDown, (state) => ({
        ...state,
        direction: DIRECTIONS.DOWN,
      }))
      .addCase(ElevatorActions.moveUp, (state) => ({
        ...state,
        direction: DIRECTIONS.UP,
      }))
      // and provide a default case if no other handlers matched
      .addDefaultCase((state, action) => state);
  },
});

// The function below is called a selector and allows us to select a value from
// the state. Selectors can also be defined inline where they're used instead of
// in the slice file. For example: `useSelector((state: RootState) => state.counter.value)`
export const getElevatorState = (state: RootState) => state.elevator;
export const getUserCurrentFloor = (state: RootState) =>
  state.elevator.userCurrentFloor;
export const getElevatorCurrentFloor = (state: RootState) =>
  state.elevator.elevatorCurrentFloor;
export const getUserSelectedFloor = (state: RootState) =>
  state.elevator.userSelectedFloor;
export const getCurrentDirection = (state: RootState) =>
  state.elevator.direction;

export default elevatorSlice.reducer;
