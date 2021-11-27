import { ElevatorApiService } from "./elevatorAPI";
import { EventName } from "./interfaces";
import * as ElevatorActions from "./elevatorActions";

const ElevatorAPI = ElevatorApiService.init();

export function mapElevatorEventsToActions(store) {
  ElevatorAPI.on(EventName.FloorButtonPressed, (floor, direction) => {
    store.dispatch(ElevatorActions.floorButtonPressed({ floor, direction }));
  });

  ElevatorAPI.on(EventName.DoorsClosed, () => {
    store.dispatch(ElevatorActions.doorsClosed());
  });

  ElevatorAPI.on(EventName.BeforeFloor, () => {
    store.dispatch(ElevatorActions.beforeFloor());
  });

  ElevatorAPI.on(EventName.CabinButtonPressed, (userSelectedFloor) => {
    store.dispatch(ElevatorActions.cabinButtonPressed({ userSelectedFloor }));
  });
}
