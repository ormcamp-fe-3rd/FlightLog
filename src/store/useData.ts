import { fetchData } from "@/lib/fetchClient";
import { create } from "zustand";
import { Robot, Operation, Telemetries } from "@/types/api";

interface DataState {
  operationData: Operation[];
  fetchOperationData: () => Promise<void>;

  robotData: Robot[];
  fetchRobotData: () => Promise<void>;

  telemetryData: Telemetries[];
  fetchTelemetryData: () => Promise<void>;
}

const useData = create<DataState>((set) => ({
  operationData: [],
  fetchOperationData: async () => {
    const result = await fetchData("operations");
    set({ operationData: result });
  },

  robotData: [],
  fetchRobotData: async () => {
    const result = await fetchData("robots");
    set({ robotData: result });
  },

  telemetryData: [],
  fetchTelemetryData: async () => {
    const result = await fetchData("telemetries");
    set({ telemetryData: result });
  },
}));

export default useData;
