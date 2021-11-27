import { Action } from "@reduxjs/toolkit";
import { combineEpics } from "redux-observable";
import {
  Observable,
  map,
  filter,
  switchMap,
  mapTo,
  withLatestFrom,
  take,
  tap,
  delay,
  ignoreElements,
} from "rxjs";
import * as ElevatorActions from "./elevatorActions";
import { ElevatorApiService } from "./elevatorAPI";
import {
  getCurrentDirection,
  getUserCurrentFloor,
  getUserSelectedFloor,
} from "./elevatorSlice";
import { DIRECTIONS, EventName } from "./interfaces";

type Deps = {
  ElevatorAPI: ElevatorApiService;
};

const currentFloorEpic = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.getCurrentFloor.match),
    switchMap(() => {
      return ElevatorAPI.getCurrentFloor().pipe(
        map((elevatorCurrentFloor) =>
          ElevatorActions.getCurrentFloorSuccess({
            elevatorCurrentFloor,
          })
        )
      );
    })
  );

const currentDirection = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.getCurrentDirection.match),
    switchMap(() => {
      return ElevatorAPI.getCurrentFloor().pipe(
        map((direction) =>
          ElevatorActions.getCurrentDirectionSuccess({ direction })
        )
      );
    })
  );

const stopAndOpenDoors = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.stopAndOpenDoors.match),
    switchMap(() => {
      return ElevatorAPI.stopAndOpenDoors().pipe(
        mapTo(ElevatorActions.stopAndOpenDoorsSuccess())
      );
    })
  );

//Stage 1
const callElevator = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.floorButtonPressed.match),
    withLatestFrom(
      state$.pipe(map(getUserSelectedFloor)),
      state$.pipe(map(getCurrentDirection))
    ),
    map(
      ([
        {
          payload: { floor },
        },
        currentFloor,
        currentDirection,
      ]) => {
        if (floor === currentFloor) {
          return ElevatorActions.stopAndOpenDoors();
        }
        //The method has no effect when `currentDirection` is not `NONE`.
        if (currentDirection !== DIRECTIONS.NONE) {
          return ElevatorActions.noop();
        }

        if (floor < currentFloor) {
          ElevatorAPI.fireEvent(EventName.BeforeFloor, {});
          return ElevatorActions.moveDown();
        }

        return ElevatorActions.moveUp();
      }
    )
  );

//Stage 2
const moveUp = (actions$: Observable<Action>, state$, { ElevatorAPI }: Deps) =>
  actions$.pipe(
    filter(ElevatorActions.moveUp.match),
    switchMap(() => {
      return ElevatorAPI.moveUp().pipe(mapTo(ElevatorActions.moveUpSuccess()));
    })
  );

const moveDown = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.moveDown.match),
    switchMap(() => {
      return ElevatorAPI.moveDown().pipe(
        mapTo(ElevatorActions.moveDownSuccess())
      );
    })
  );

//Stage 3
const moveUpSuccess = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.moveDownSuccess.match),
    map(() => ElevatorActions.stopAndOpenDoors())
  );

const moveDownSuccess = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.moveUpSuccess.match),
    map(() => ElevatorActions.stopAndOpenDoors())
  );

//Stage 4
const stopAndOpenDoorsSuccess = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.stopAndOpenDoorsSuccess.match),
    // stopped for one user full cycle
    take(1),
    tap(() =>
      ElevatorAPI.fireEvent(EventName.CabinButtonPressed, {
        floor: 5,
      })
    ),
    ignoreElements()
  );

//Stage 5
const cabinButtonPressed = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.cabinButtonPressed.match),
    delay(2000),
    tap(() => ElevatorAPI.fireEvent(EventName.DoorsClosed, {})),
    ignoreElements()
  );

//Stage 6
const doorsClosed = (
  actions$: Observable<Action>,
  state$,
  { ElevatorAPI }: Deps
) =>
  actions$.pipe(
    filter(ElevatorActions.doorsClosed.match),
    delay(2000),
    withLatestFrom(
      state$.pipe(map(getUserCurrentFloor)),
      state$.pipe(map(getUserSelectedFloor))
    ),
    map(([, userCurrentFloor, userSelectedFloor]) => {
      if (userCurrentFloor === userSelectedFloor) {
        return ElevatorActions.stopAndOpenDoors();
      }

      if ((userSelectedFloor as number) > userCurrentFloor) {
        return ElevatorActions.moveUp();
      }

      return ElevatorActions.moveDown();
    })
  );

const elevatorEpic = combineEpics<ElevatorActions.ActionsUnion>(
  currentFloorEpic,
  currentDirection,
  stopAndOpenDoors,
  callElevator,
  moveUp,
  moveDown,
  moveUpSuccess,
  moveDownSuccess,
  stopAndOpenDoorsSuccess,
  cabinButtonPressed,
  doorsClosed
);
export default elevatorEpic;
