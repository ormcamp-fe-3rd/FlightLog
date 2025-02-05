// import Link from "next/link";

export default function Cards() {
  return (
    <section className="mb-20">
      <div className="flex flex-row gap-8 md:flex-col md:gap-4">
        <div className="card flex-1 md:w-full">
          {/* <Link href="/log"> */}
          <div className="mb-4 flex aspect-video rounded-lg bg-gray-300 shadow-md">
            <img
              className="h-full w-full object-cover"
              src="/images/common/drone-map.png"
              alt="드론 경로 데이터 시각화 이미지"
            />
          </div>
          {/* </Link> */}
          <div>
            <h3 className="card-title">실시간 데이터 시각화</h3>
            <p>
            지도 위에 여러 드론의 경로를 동시에 띄워 전반적인 모니터링 및 분석이 가능합니다. 
            </p>
          </div>
        </div>

        <div className="card flex-1">
          {/* <Link href="/map"> */}
          <div className="mb-4 flex aspect-video rounded-lg bg-gray-300 shadow-md">
            <img
              className="h-full w-full object-cover"
              src="/images/common/drone-tracking.png"
              alt="flight log의 맵 서비스 ui 이미지"
            />
          </div>
          {/* </Link> */}
          <div>
            <h3 className="card-title">드론의 움직임 추적</h3>
            <p>
              tracking을 활용해 드론의 시간별 움직임을 시간별로 따라다니며 상태를 확인할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="card flex-1">
          {/* <Link href="/map"> */}
          <div className="mb-4 flex aspect-video rounded-lg bg-gray-300 shadow-md">
            <img
              className="h-full w-full object-cover"
              src="/images/common/drone-3d.png"
              alt="웹사이트에 3d 입체로 구현한 드론 이미지"
            />
          </div>
          {/* </Link> */}
          <div>
            <h3 className="card-title">3D 자세 분석</h3>
            <p>
              Roll, Pitch, Yaw 데이터를 기반으로 드론의 자세를 3d모델로
              확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
