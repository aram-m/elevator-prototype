import { createAction } from "@reduxjs/toolkit";
import { DIRECTIONS } from "./interfaces";

export const floorButtonPressed = createAction<{
  floor: number;
  direction: DIRECTIONS;
}>("[Elevator/API] floorButtonPressed");

export const stopAndOpenDoors = createAction("[Elevator/API] stopAndOpenDoors");

export const stopAndOpenDoorsSuccess = createAction(
  "[Elevator/API] stopAndOpenDoorsSuccess"
);

export const cabinButtonPressed = createAction<{ userSelectedFloor: number }>(
  "[Elevator/API] cabinButtonPressed"
);

export const updateElevatorCurrentFloor = createAction<{
  elevatorCurrentFloor: number;
}>("[Elevator/API] updateElevatorCurrentFloor");

export const getCurrentDirection = createAction<{ direction: DIRECTIONS }>(
  "[Elevator/API] getCurrentDirection"
);

export const getCurrentDirectionSuccess = createAction<{
  direction: DIRECTIONS;
}>("[Elevator/API] getCurrentDirectionSuccess");

export const doorsClosed = createAction("[Elevator/API] doorsClosed");

export const beforeFloor = createAction("[Elevator/API] beforeFloor");

export const moveUp = createAction("[Elevator/API] moveUp");

export const moveUpSuccess = createAction("[Elevator/API] moveUpSuccess");

export const moveDown = createAction("[Elevator/API] moveDown");

export const moveDownSuccess = createAction("[Elevator/API] moveDownSuccess");

export const getCurrentFloor = createAction("[Elevator/API] getCurrentFloor");

export const getCurrentFloorSuccess = createAction<{
  elevatorCurrentFloor: number;
}>("[Elevator/API] getCurrentFloorSuccess");

export const noop = createAction("[Elevator/API] noop");

export type ActionsUnion =
  | ReturnType<typeof floorButtonPressed>
  | ReturnType<typeof stopAndOpenDoors>
  | ReturnType<typeof stopAndOpenDoorsSuccess>
  | ReturnType<typeof cabinButtonPressed>
  | ReturnType<typeof getCurrentDirection>
  | ReturnType<typeof doorsClosed>
  | ReturnType<typeof beforeFloor>
  | ReturnType<typeof moveUp>
  | ReturnType<typeof moveUpSuccess>
  | ReturnType<typeof moveDown>
  | ReturnType<typeof moveDownSuccess>
  | ReturnType<typeof getCurrentFloor>
  | ReturnType<typeof getCurrentFloorSuccess>
  | ReturnType<typeof noop>;
