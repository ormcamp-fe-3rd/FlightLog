import useData from "@/store/useData";

interface SelectFlightLogProps {
  value: string;
  onSelect: (value: string) => void;
}

export default function SelectFlightLog({
  value,
  onSelect,
}: SelectFlightLogProps) {
  const { selectedOperationId, validOperationLabels } = useData();

  const handleSelection = (value: string) => {
    onSelect(value);
  };

  return (
    <div className="w-[280px]">
      <select
        className="select select-bordered w-full max-w-xs"
        onChange={(e) => handleSelection(e.target.value)}
        value={value}
      >
        <option disabled>Select Operation</option>
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
