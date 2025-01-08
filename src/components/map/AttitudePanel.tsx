export default function AttitudePanel() {
  return (
    <div className="flex h-full w-full flex-col justify-between p-4">
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
