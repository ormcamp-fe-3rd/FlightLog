interface ControlPanelProps {
  onFlightInfoClick: () => void;
  onAttitudeClick: () => void;
  onZoomClick: () => void;
}

export default function ControlPanel({
  onFlightInfoClick,
  onAttitudeClick,
  onZoomClick,
}: ControlPanelProps) {
  return (
    <div>
      <div className="flex h-16 w-72 items-center justify-around rounded-[30px] bg-white">
        <button
          className="flex w-20 flex-col items-center"
          onClick={onFlightInfoClick}
        >
          <img
            src="/images/map/icon-control-info.svg"
            alt="Flight info"
            className="size-7"
          />
          <div>Flight info</div>
        </button>
        <button
          className="flex w-20 flex-col items-center"
          onClick={onAttitudeClick}
        >
          <img
            src="/images/map/icon-control-attitude.svg"
            alt="Flight Attitude"
            className="size-7"
          />
          <div>Attitude</div>
        </button>
        <button
          className="flex w-20 flex-col items-center"
          onClick={onZoomClick}
        >
          <img
            src="/images/map/icon-control-zoom.svg"
            alt="Zoom"
            className="size-7 p-1"
          />
          <div>Zoom</div>
        </button>
      </div>
    </div>
  );
}
