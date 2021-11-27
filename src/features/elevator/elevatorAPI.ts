import {
  filter,
  Observable,
  of,
  Subject,
  Subscription,
  tap,
  timer,
} from "rxjs";
import {
  DIRECTIONS,
  EventName,
  EventNameCallbackMap,
  EventNamePayloadMap,
  HardwareElevatorInterface,
} from "./interfaces";

export class ElevatorApiService implements HardwareElevatorInterface {
  private static _instance: ElevatorApiService = null;

  private readonly eventBus = new Subject<{
    eventName: EventName;
    payload: any;
  }>();
  private readonly events$ = this.eventBus.asObservable();

  protected constructor() {}

  // Singleton
  static init() {
    if (ElevatorApiService._instance) {
      return ElevatorApiService._instance;
    }

    return (ElevatorApiService._instance = new ElevatorApiService());
  }

  /**
   * When the elevator is moving - the method returns the last passed floor number (i.e. the last floor the
   * elevator just went by). if the floor is 3 and the direction is `UP` - the method returns 3 until the elevator
   * reaches floor 4.
   * When the elevator is not moving, the method returns the current floor number.
   * @return {number} Floor number.
   */
  getCurrentFloor(): Observable<number> {
    return of(1);
  }

  /**
   * Returns current direction.
   * @return {number} Any of `DIRECTIONS`
   */
  getCurrentDirection(): Observable<DIRECTIONS> {
    return of();
  }

  /**
   * Stops on the next floor (i.e. when the method is called and the elevator is moving from floor 1 with direction
   * `UP` - the elevator stops on floor 2). When the elevator is not moving - it just opens and closes the elevator
   * doors.
   * In all cases, the method sets `DIRECTIONS` to `NONE`.
   * When the doors are opened, they close automatically after some time.
   * Once the doors are closed, the "doorsClosed" event is fired.
   */
  stopAndOpenDoors(): Observable<number> {
    return timer(2000);
  }

  /**
   * The method moves the elevator up until `stopAndOpenDoors` is not called. The method sets `currentDirection`
   * to `UP`.
   * The method has no effect when `currentDirection` is not `NONE`.
   * Hardware elevator does not know the total number of floors in a building, it will try to continue its movement
   * even if there is nowhere to move to.
   */
  moveUp(): Observable<number> {
    return timer(2000);
  }

  /**
   * The method moves the elevator down until `stopAndOpenDoors` is not called. The method sets `currentDirection`
   * to `DOWN`.
   * The method has no effect when `currentDirection` is not `NONE`.
   * Hardware elevator does not know the total number of floors in a building, it will try to continue its movement
   * even if there is nowhere to move to.
   */
  moveDown(): Observable<number> {
    return timer(2000);
  }

  on<T extends EventName, C extends EventNameCallbackMap[T]>(
    event: T,
    callback: C
  ): Subscription {
    return this.events$
      .pipe(
        filter(({ eventName }) => event === eventName),
        tap(({ payload }) => {
          switch (event) {
            case EventName.DoorsClosed:
            case EventName.BeforeFloor: {
              (callback as any)();
              break;
            }
            case EventName.FloorButtonPressed: {
              (callback as any)(payload.floor, payload.direction);
              break;
            }
            case EventName.CabinButtonPressed: {
              (callback as any)(payload.floor);
              break;
            }
          }
        })
      )
      .subscribe();
  }

  fireEvent<T extends EventName, P extends EventNamePayloadMap[T]>(
    eventName: T,
    payload: P
  ) {
    this.eventBus.next({ eventName, payload });
  }
}
