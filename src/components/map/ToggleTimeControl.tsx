import React from "react";
import ToggleButton from "./ToggleButton";

interface ToggleTimeControlProps {
  isProgressBar: boolean;
  onToggle: () => void;
}

const ToggleTimeControl: React.FC<ToggleTimeControlProps> = ({
  isProgressBar,
  onToggle,
}) => {
  return (
    <div className="flex items-center justify-center">
      <ToggleButton onClick={onToggle} isProgressBar={isProgressBar} />
    </div>
  );
};

export default ToggleTimeControl;
