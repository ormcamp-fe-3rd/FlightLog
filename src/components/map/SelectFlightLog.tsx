import useData from "@/store/useData";
import { getColorFromId } from "@/utils/getColorFromId";
import Select from "react-select";

interface SelectFlightLogProps {
  value: string;
  onSelect: (value: string) => void;
}
interface OptionType {
  value: string;
  label: string;
  color: string;
  isDisabled?: boolean;
}

export default function SelectFlightLog({
  value,
  onSelect,
}: SelectFlightLogProps) {
  const { selectedOperationId, validOperationLabels } = useData();

  const options: OptionType[] = [
    {
      value: "",
      label: "Select Operation",
      color: "",
    },
    ...selectedOperationId
      .sort((a, b) => {
        const dateA = new Date(validOperationLabels[a]).getTime();
        const dateB = new Date(validOperationLabels[b]).getTime();
        return dateA - dateB;
      })
      .map((id) => ({
        value: id,
        label: validOperationLabels[id],
        color: getColorFromId(id),
      })),
  ];

  const selectedOption = value
    ? options.find((option) => option.value === value)
    : null;

  const CustomOption = ({
    innerProps,
    label,
    data,
  }: {
    innerProps: React.HTMLAttributes<HTMLDivElement>;
    label: string;
    data: OptionType;
  }) => (
    <div
      {...innerProps}
      className="flex cursor-pointer items-center justify-between gap-2 px-3 py-2 hover:bg-gray-100"
    >
      <span className="flex">{label}</span>
      {data.color && (
        <span
          className="inline-flex h-2 w-2 rounded-full"
          style={{ backgroundColor: data.color }}
        />
      )}
    </div>
  );

  const handleChange = (option: OptionType | null) => {
    if (option && !option.isDisabled) {
      onSelect(option.value);
    } else {
      onSelect("");
    }
  };

  return (
    <div className="w-[280px]">
      <Select
        className="z-50 w-full cursor-pointer"
        onChange={handleChange}
        options={options}
        components={{ Option: CustomOption }}
        value={selectedOption}
        placeholder="Select Operation"
      />
    </div>
  );
}
