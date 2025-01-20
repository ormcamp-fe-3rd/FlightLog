interface ToggleButtonProps {
  onClick: () => void;
  isProgressBar: boolean;
}

const ToggleButton: React.FC<ToggleButtonProps> = ({
  onClick,
  isProgressBar,
}) => {
  return (
    <div className="flex items-center gap-2">
      <label className="cursor-pointer">
        <input
          type="checkbox"
          className="toggle align-middle"
          checked={isProgressBar}
          onChange={onClick}
        />
        <span className="ml-2 text-sm leading-none">
          {isProgressBar ? "Progress Bar" : "Time Search"}
        </span>
      </label>
    </div>
  );
};

export default ToggleButton;
