import { CONTROL_BUTTONS } from "@/constants";

interface ControlButtonProps {
  icon: string;
  label: string;
  onClick: () => void;
  iconClassName?: string;
}

interface ControlPanelProps {
  onFlightInfoClick: () => void;
  onAttitudeClick: () => void;
  onZoomClick: () => void;
}

function ControlButton({
  icon,
  label,
  onClick,
  iconClassName,
}: ControlButtonProps) {
  return (
    <button className="flex w-20 flex-col items-center" onClick={onClick}>
      <img src={icon} alt={label} className={iconClassName} />
      <div>{label}</div>
    </button>
  );
}

export default function ControlPanel({
  onFlightInfoClick,
  onAttitudeClick,
  onZoomClick,
}: ControlPanelProps) {
  const buttonActions = {
    flightInfo: onFlightInfoClick,
    attitude: onAttitudeClick,
    zoom: onZoomClick,
  };

  return (
    <div>
      <div className="w-73 flex h-16 items-center justify-around rounded-[30px] bg-white p-1">
        {CONTROL_BUTTONS.map(({ id, icon, label, iconClassName }) => (
          <ControlButton
            key={id}
            icon={icon}
            label={label}
            onClick={buttonActions[id]}
            iconClassName={iconClassName}
          />
        ))}
      </div>
    </div>
  );
}
