export default function AttitudePanel() {
  return (
    <div className="flex size-[280px] flex-shrink-0 flex-col justify-between rounded-[30px] bg-white p-4 opacity-90">
      <div>
        <div>Roll: </div>
        <div>Pitch: </div>
        <div>Yaw: </div>
      </div>
      <div className="flex w-full justify-between">
        <div>
          <div>Roll 속도</div>
          <div>Roll 속도</div>
        </div>
        <div>
          <div>Pitch 속도</div>
          <div>Pitch 속도</div>
        </div>
        <div>
          <div>Yaw 속도</div>
          <div>Yaw 속도</div>
        </div>
      </div>
    </div>
  );
}
