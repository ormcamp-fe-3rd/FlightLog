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

const useData = create<DataState>((set, get) => ({
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

    const selectedOperations = new Set(get().selectedOperationId);

    const filteredData = result.filter((telemetry) =>
      selectedOperations.has(telemetry.operation),
    );

    // msgId별로 데이터를 그룹화
    const categorizedData = filteredData.reduce(
      (acc: { [key: string]: Telemetries[] }, data: Telemetries) => {
        const { msgId } = data;

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
    set({ selectedOperationId: formattedData });

    get().fetchTelemetryData();
  },

  toggleSelectedOperation: (operationId) => {
    set((state) => {
      const selectedOperationsSet = new Set(state.selectedOperationId);

      selectedOperationsSet.has(operationId)
        ? selectedOperationsSet.delete(operationId)
        : selectedOperationsSet.add(operationId);

      return { selectedOperationId: [...selectedOperationsSet] };
    });
    // 체크할 때만 텔레메트리 데이터 요청
    get().fetchTelemetryData();
  },
}));

export default useData;
