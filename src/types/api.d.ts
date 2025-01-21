export interface Operation {
  _id: string;
  robot: string;
}

export interface Robot {
  _id: string;
  name: string;
}

export interface Telemetries {
  _id: string;
  operation: string;
  robot: string;
  msgId: string;
  payload: Record<string, any>;
  timestamp: string;
  __v: number;
}
