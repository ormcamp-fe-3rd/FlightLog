import { fetchData } from "@/lib/fetchClient";
import { create, useStore } from "zustand";
import { Robot, Operation, Telemetries } from "@/types/api";

interface DataState {
  operationData: Operation[];
  fetchOperationData: () => Promise<void>;

  robotData: Robot[];
  fetchRobotData: () => Promise<void>;

  telemetryData: { [key: string]: Telemetries[] };
  fetchTelemetryData: (operationIds?: string[]) => Promise<void>;

  validOperationLabels: Record<string, string>;
  setValidOperationLabel: (labels: Record<string, string>) => void;

  selectedOperationId: string[];
  setSelectedOperation: (operations: Record<string, string>) => void;
  toggleSelectedOperation: (operationId: string) => void;
  fetchInitialTelemetries: () => Promise<void>;
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
  fetchTelemetryData: async (operationIds?: string[]) => {
    const selectedOperations = operationIds || get().selectedOperationId;

    if (selectedOperations.length === 0) {
      set({ telemetryData: {} });

      return;
    }

    const promises = selectedOperations.map(async (operationId) => {
      try {
        const data = await fetchData(`telemetries`, { operation: operationId });
        return data;
      } catch (error) {
        console.error(
          `오퍼레이션을 불러오는데 실패했습니다. ${operationId}:`,
          error,
        );
        return [];
      }
    });

    try {
      const results = await Promise.all(promises);
      const allTelemetries = results.flat();

      const categorizedData = allTelemetries.reduce(
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
    } catch (error) {
      console.error("텔레메트리를 불러오는데 실패했습니다.", error);
      set({ telemetryData: {} });
    }
  },

  validOperationLabels: {},
  setValidOperationLabel: (labels) => {
    set({ validOperationLabels: labels });
  },

  selectedOperationId: [],
  setSelectedOperation: (operations) => {
    const formattedData = Object.keys(operations);
    set({ selectedOperationId: formattedData });
    // 새로 선택된 operation들의 데이터만 불러오기
    get().fetchTelemetryData(formattedData);
  },
  toggleSelectedOperation: (operationId) => {
    set((state) => {
      const selectedOperationsSet = new Set(state.selectedOperationId);

      if (selectedOperationsSet.has(operationId)) {
        selectedOperationsSet.delete(operationId);
      } else {
        selectedOperationsSet.add(operationId);
      }

      const newSelectedOperations = [...selectedOperationsSet];
      // 토글된 후의 operation 목록으로 데이터 불러오기
      get().fetchTelemetryData(newSelectedOperations);

      return { selectedOperationId: newSelectedOperations };
    });
  },

  fetchInitialTelemetries: async () => {
    const { operationData } = get();
    if (operationData.length === 0) return;

    // 각 운행에 대해 가장 최근 데이터 로드
    const promises = operationData.map(async (operation) => {
      try {
        const data = await fetchData(`telemetries`, {
          operation: operation._id,
          msgId: "33",
          //라벨링을 위한 데이터 1개만 로드
          limit: "1",
        });
        return data[0];
      } catch (error) {
        console.error(
          `운행 시간 데이터를 불러오는데 실패했습니다.${operation._id}:`,
          error,
        );
        return null;
      }
    });

    try {
      const results = await Promise.all(promises);
      const validResults = results.filter((result) => result !== null);

      const categorizedData = validResults.reduce(
        (acc: { [key: string]: Telemetries[] }, data: Telemetries) => {
          if (!data) return acc;
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
    } catch (error) {
      console.error("운행 시간 데이터를 불러오는데 실패했습니다.", error);
    }
  },
}));

export default useData;
