import { TIMELINE } from "@/constants";
import { getTimelineStyles } from "@/utils/getTimelineStyles";
import { TimelineData } from "@/types/types";
import { timelineCaculator } from "@/utils/timelineCalculator";

interface Props {
  allTimestamps: number[];
  operationTimestamps: Record<string, number[]>;
  onTimelineClick: (id: string, timelineData: TimelineData[]) => void;
}

export default function Timeline({
  allTimestamps,
  operationTimestamps,
  onTimelineClick,
}: Props) {
  const startTimestamp = allTimestamps[0];
  const endTimestamp = allTimestamps[allTimestamps.length - 1];
  const totalDuration = endTimestamp - startTimestamp;

  const timelineData = timelineCaculator.calculateData(operationTimestamps);
  const maxLayer = Math.max(...timelineData.map((op) => op.layer));
  const maxLayerHeight = (maxLayer + 1) * (TIMELINE.HEIGHT + TIMELINE.GAP);

  return (
    <div
      className="relative w-full overflow-x-clip"
      style={{ height: `${maxLayerHeight}px` }}
    >
      {timelineData.map((operation) => {
        const styles = getTimelineStyles(
          operation,
          startTimestamp,
          totalDuration,
        );
        return (
          <div
            key={operation.id}
            className="absolute h-1 cursor-pointer rounded-full"
            style={styles}
            onClick={() => onTimelineClick(operation.id, timelineData)}
          />
        );
      })}
    </div>
  );
}
