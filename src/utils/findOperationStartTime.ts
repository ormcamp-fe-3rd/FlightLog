import { Telemetries } from "@/types/api";

export default function findOperationStartTime(
  operationId: string,
  positionData: Telemetries[] | [],
) {
  const data = positionData.find((telemetry) => {
    return telemetry.operation === operationId;
  });

  if (data && data.timestamp) {
    return data.timestamp;
  } else {
    console.warn(`No timestamp found for operation ID: ${operationId}`);
    return "No timestamp found";
  }
}
