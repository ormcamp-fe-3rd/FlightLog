import React from "react";

interface TimeSearchProps {
  onTimeChange: (time: string) => void;
}

const TimeSearch: React.FC<TimeSearchProps> = ({ onTimeChange }) => {
  const handleTimeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const selectedTime = event.target.value;
    onTimeChange(selectedTime);
  };

  return (
    <div className="flex flex-col items-start gap-2">
      <label htmlFor="time-search" className="text-sm font-medium">
        시간 검색
      </label>
      <input
        id="time-search"
        type="datetime-local"
        onChange={handleTimeChange}
        className="rounded border p-2 shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
      />
    </div>
  );
};

export default TimeSearch;
