import useData from "@/store/useData";

interface SelectFlightLogProps {
  onSelect: (value: string) => void;
}

export default function SelectFlightLog({ onSelect }: SelectFlightLogProps) {
  const { selectedOperationId, validOperationLabels } = useData();
  return (
    <div className="w-[280px]">
      <select
        className="select select-bordered w-full max-w-xs"
        onChange={(e) => onSelect(e.target.value)}
      >
        <option value="">Select Operation</option>
        {selectedOperationId.map((id) => {
          return (
            <option key={id} value={id}>
              {validOperationLabels[id]}
            </option>
          );
        })}
      </select>
    </div>
  );
}
