export interface TimelineData {
  layer: number;
  id: string;
  start: number;
  end: number;
}

export interface DronePosition {
  flightId: string;
  position: [number, number];
  direction: number;
}
