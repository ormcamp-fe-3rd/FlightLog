import { fetchData } from "@/lib/fetchClient";
import { create } from "zustand";
import { Robot, Operation, Telemetries } from "@/types/api";

interface DataState {
  operationData: Operation[];
  fetchOperationData: () => Promise<void>;

  robotData: Robot[];
  fetchRobotData: () => Promise<void>;

  telemetryData: { [key: string]: Telemetries[] };
  fetchTelemetryData: () => Promise<void>;

  validOperationLabels: Record<string, string>;
  setValidOperationLabel: (labels: Record<string, string>) => void;

  selectedOperationId: string[];
  setSelectedOperation: (operations: Record<string, string>) => void;
  toggleSelectedOperation: (operationId: string) => void;
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

  telemetryData: {},
  fetchTelemetryData: async () => {
    const result = await fetchData("telemetries");

    // msgId별로 데이터를 배열로 저장
    const categorizedData = result.reduce(
      (acc: { [key: string]: Telemetries[] }, data: Telemetries) => {
        const { msgId } = data; // msgId 추출

        if (!acc[msgId]) {
          acc[msgId] = [];
        }
        acc[msgId].push(data);

        return acc;
      },
      {},
    );
    set({ telemetryData: categorizedData });
  },

  validOperationLabels: {},
  setValidOperationLabel: (labels) => {
    set({ validOperationLabels: labels });
  },

  selectedOperationId: [],
  setSelectedOperation: (operations) => {
    const formattedData = Object.keys(operations);
    return set({ selectedOperationId: formattedData });
  },
  toggleSelectedOperation: (operationId) => {
    set((state) => {
      const selectedOperationsSet = new Set(state.selectedOperationId);

      selectedOperationsSet.has(operationId)
        ? selectedOperationsSet.delete(operationId)
        : selectedOperationsSet.add(operationId);

      return { selectedOperationId: [...selectedOperationsSet] };
    });
  },
}));

export default useData;
