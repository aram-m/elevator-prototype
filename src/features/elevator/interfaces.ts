import { Observable } from "rxjs";

export enum EventName {
  DoorsClosed = "doorsClosed",
  BeforeFloor = "beforeFloor",
  FloorButtonPressed = "floorButtonPressed",
  CabinButtonPressed = "cabinButtonPressed",
}

export interface EventNameCallbackMap {
  [EventName.DoorsClosed]: () => void;
  [EventName.BeforeFloor]: () => void;
  [EventName.CabinButtonPressed]: (floor: number) => void;
  [EventName.FloorButtonPressed]: (
    floor: number,
    direction: DIRECTIONS
  ) => void;
}

export interface EventNamePayloadMap {
  [EventName.DoorsClosed]: {};
  [EventName.BeforeFloor]: {};
  [EventName.CabinButtonPressed]: { floor: number };
  [EventName.FloorButtonPressed]: { floor: number; direction: DIRECTIONS };
}

export enum DIRECTIONS {
  DOWN = -1,
  NONE = 0,
  UP = 1,
}

export interface HardwareElevatorInterface {
  getCurrentFloor(): Observable<number>;
  getCurrentDirection(): Observable<DIRECTIONS>;
  stopAndOpenDoors(): Observable<number>;
  moveUp(): Observable<number>;
  moveDown(): Observable<number>;
  on<T extends EventName, C extends EventNameCallbackMap[T]>(
    event: T,
    callback: C
  ): void;
}

// export interface ElevatorInteractorInterface<
//   T extends HardwareElevatorInterface
// > {
//   // 1 FloorButtonPressed event fired
//   pressOnFloorButton(
//     floor: number,
//     direction: DIRECTIONS.DOWN | DIRECTIONS.UP
//   ): void;

//   //
//   // HardwareElevatorInterface.stopAndOpenDoors()

//   // 3 CabinButtonPressed event fired
//   pressOnCabinButton(floor: number): void;

//   // 4
//   // DoorsClosed event fired

//   // 5
//   // HardwareElevatorInterface.moveUp() | HardwareElevatorInterface.moveDown()
// }
