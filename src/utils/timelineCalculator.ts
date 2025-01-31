interface timelineData {
  id: string;
  start: number;
  end: number;
}

export const timelineCaculator = {
  calculateData(operationTimestamps: Record<string, number[]>) {
    const timelineData = this.convertToTimelineOperations(operationTimestamps);
    return this.assignLayers(timelineData);
  },

  convertToTimelineOperations(operationTimestamps: Record<string, number[]>) {
    return Object.entries(operationTimestamps).map(([id, timestamps]) => ({
      id,
      start: Math.min(...timestamps),
      end: Math.max(...timestamps),
    }));
  },

  assignLayers(timelineData: timelineData[]) {
    const layers: number[] = []; // 각 층의 가장 최근 end값을 저장

    return timelineData.map((operation) => {
      const layer = this.findAvailableLayer(operation.start, layers);
      layers[layer] = operation.end;
      return { ...operation, layer };
    });
  },

  // 사용할 수 있는 층이 없으면 새 층 추가, 있으면 기존 층에 배치
  findAvailableLayer(start: number, layers: number[]) {
    const existingLayer = layers.findIndex((endTime) => start >= endTime);
    return existingLayer === -1 ? layers.length : existingLayer;
  },
};
