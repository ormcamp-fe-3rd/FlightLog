export default function ControlPanel() {
  return (
    <div>
      <div className="flex h-16 w-72 items-center justify-around rounded-[30px] bg-white">
        <div className="flex w-20 flex-col items-center">
          <img
            src="/images/map/icon-control-info.svg"
            alt="flight-info"
            className="size-7"
          />
          <div>Flight info</div>
        </div>
        <div className="flex w-20 flex-col items-center">
          <img
            src="/images/map/icon-control-attitude.svg"
            alt="flight-attitude"
            className="size-7"
          />
          <div>Attitude</div>
        </div>
        <div className="flex w-20 flex-col items-center">
          <img
            src="/images/map/icon-control-zoom.svg"
            alt="flight-zoom"
            className="size-7 p-1"
          />
          <div>Zoom</div>
        </div>
      </div>
    </div>
  );
}
