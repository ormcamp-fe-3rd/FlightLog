import { TIMELINE } from "@/constants";
import { getColorFromId } from "@/utils/getColorFromId";

export const getTimelineStyles = (
  operation: {
    layer: number;
    id: string;
    start: number;
    end: number;
  },
  startTimestamp: number,
  totalDuration: number,
) => {
  const startPercent =
    ((operation.start - startTimestamp) / totalDuration) * 100;
  const endPercent = ((operation.end - startTimestamp) / totalDuration) * 100;

  return {
    left: `${startPercent}%`,
    width: `${endPercent - startPercent}%`,
    top: `${operation.layer * (TIMELINE.HEIGHT + TIMELINE.GAP)}px`,
    height: `${TIMELINE.HEIGHT}px`,
    backgroundColor: getColorFromId(operation.id),
  };
};
