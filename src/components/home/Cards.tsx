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
              src="https://blog.oyuncakhobi.com/wp-content/uploads/2023/10/mission_planner_screen_flight_plan.jpg"
              alt="드론 경로 데이터 시각화 이미지"
            />
          </div>
          {/* </Link> */}
          <div>
            <h3 className="card-title">실시간 데이터 시각화</h3>
            <p>
              배터리 상태, 고도, 속도 등 다양한 비행 데이터를 실시간으로
              모니터링하고 분석할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="card flex-1">
          {/* <Link href="/map"> */}
          <div className="mb-4 flex aspect-video rounded-lg bg-gray-300 shadow-md">
            <img
              className="h-full w-full object-cover"
              src="https://cdn.prod.website-files.com/64e895a2f8733943c6d0ddef/65ae39f0e69f1b67eb2b8c8c_Map%20UI%20Element%20-%20uinkits.png"
              alt="flight log의 맵 서비스 ui 이미지"
            />
          </div>
          {/* </Link> */}
          <div>
            <h3 className="card-title">지도 기반 위치 추적</h3>
            <p>
              GPS 데이터를 활용하여 드론의 비행 경로와 시간별 위치를 지도상에
              확인할 수 있습니다.
            </p>
          </div>
        </div>

        <div className="card flex-1">
          {/* <Link href="/map"> */}
          <div className="mb-4 flex aspect-video rounded-lg bg-gray-300 shadow-md">
            <img
              className="h-full w-full object-cover"
              src="https://dronecentral.in/wp-content/uploads/2024/09/air-2s-img-4.webp"
              alt="웹사이트에 3d 입체로 구현한 드론 이미지"
            />
          </div>
          {/* </Link> */}
          <div>
            <h3 className="card-title">3D 자세 분석</h3>
            <p>
              Roll, Pitch, Yaw 데이터를 기반으로 드론의 3차원 자세를 실시간으로
              확인할 수 있습니다.
            </p>
          </div>
        </div>
      </div>
    </section>
  );
}
