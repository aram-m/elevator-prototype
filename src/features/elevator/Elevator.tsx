import { useEffect } from "react";
import { useAppSelector, useAppDispatch } from "../../app/hooks";
import { getUserCurrentFloor } from "./elevatorSlice";
import { ElevatorApiService } from "./elevatorAPI";
import { DIRECTIONS, EventName } from "./interfaces";

const ElevatorAPI = ElevatorApiService.init();

export function Elevator() {
  const dispatch = useAppDispatch();
  const selectUserCurrentFloor = useAppSelector(getUserCurrentFloor);

  useEffect(() => {
    ElevatorAPI.fireEvent(EventName.FloorButtonPressed, {
      floor: selectUserCurrentFloor,
      direction: DIRECTIONS.UP,
    });

    //testing requirement below
    //The method has no effect when `currentDirection` is not `NONE`.
    setTimeout(() => {
      ElevatorAPI.fireEvent(EventName.FloorButtonPressed, {
        floor: selectUserCurrentFloor,
        direction: DIRECTIONS.UP,
      });
    }, 2500);
  }, [selectUserCurrentFloor, dispatch]);

  return <></>;
}
