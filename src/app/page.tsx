import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl break-keep px-4 py-12">
      <section className="mb-7">
        <div className="flex flex-row items-center gap-8 md:flex-col">
          <div className="flex-1 md:text-center">
            <h1 className="mb-4 text-5xl font-bold leading-tight">
              드론 비행의
              <br />
              모든 것을 한눈에
            </h1>
            <p className="mb-4 max-w-lg text-xl text-gray-600">
              FightLog는 비행 로봇의 운행 데이터를 통합하고 분석하는
              플랫폼입니다. 비행 데이터를 시간 단위로 분석하고 관리하세요. 언제
              어디서나 드론의 상태와 비행 기록을 한눈에 확인할 수 있습니다.
            </p>
            <Link
              href="/map"
              className="btn btn-primary btn-wide transition-all hover:scale-[1.02]"
            >
              시작하기
            </Link>
          </div>
          <div className="flex-1 md:order-last">
            <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
              <img
                src="/images/home/flight-log-main-image.jpg"
                className="h-full w-full object-cover"
                alt="첨단 비행 로봇 서비스를 시각화한 가상의 이미지"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-24">
        <div className="grid grid-cols-2 gap-8 md:grid-cols-1">
          <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
            <img
              src="/images/home/Agri-drone.jpg"
              alt="농사에 활용하는 드론 이미지"
              className="h-full w-full object-cover"
            />
          </div>
          <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
            <img
              src="/images/home/construction-drone.jpg"
              alt="건축 현장의 드론 활용 이미지"
              className="h-full w-full object-cover"
            />
          </div>
        </div>
      </section>

      <section className="mb-20 text-center">
        <h1 className="mb-4 text-5xl font-bold">비행 데이터 분석 플랫폼</h1>
        <p className="mb-5 text-xl">
          비행 중 수집된 모든 텔레메트리 데이터를 상세하게 분석하고
          시각화합니다.
        </p>
        <div className="flex justify-center"></div>
      </section>

      <section className="mb-20">
        <div className="flex flex-row gap-8 md:flex-col md:gap-4">
          <div className="card flex-1 md:w-full">
            <Link href="/log">
              <div className="mb-4 flex aspect-video cursor-pointer rounded-lg bg-gray-300 shadow-md transition-all hover:scale-[1.02]">
                <img
                  className="h-full w-full object-cover"
                  src="https://blog.oyuncakhobi.com/wp-content/uploads/2023/10/mission_planner_screen_flight_plan.jpg"
                  alt="드론 경로 데이터 시각화 이미지"
                ></img>
              </div>
            </Link>
            <div>
              <h3 className="card-title">실시간 데이터 시각화</h3>
              <p>
                배터리 상태, 고도, 속도 등 다양한 비행 데이터를 실시간으로
                모니터링하고 분석할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="card flex-1">
            <Link href="/map">
              <div className="mb-4 flex aspect-video cursor-pointer rounded-lg bg-gray-300 shadow-md transition-all hover:scale-[1.02]">
                <img
                  className="h-full w-full object-cover"
                  src="https://cdn.prod.website-files.com/64e895a2f8733943c6d0ddef/65ae39f0e69f1b67eb2b8c8c_Map%20UI%20Element%20-%20uinkits.png"
                  alt="flight log의 맵 서비스 ui 이미지"
                ></img>
              </div>
            </Link>
            <div>
              <h3 className="card-title">지도 기반 위치 추적</h3>
              <p>
                GPS 데이터를 활용하여 드론의 비행 경로와 시간별 위치를 지도상에
                확인할 수 있습니다.
              </p>
            </div>
          </div>

          <div className="card flex-1">
            <Link href="/map">
              <div className="mb-4 flex aspect-video cursor-pointer rounded-lg bg-gray-300 shadow-md transition-all hover:scale-[1.02]">
                <img
                  className="h-full w-full object-cover"
                  src="https://dronecentral.in/wp-content/uploads/2024/09/air-2s-img-4.webp"
                  alt="웹사이트에 3d 입체로 구현한 드론 이미지"
                ></img>
              </div>
            </Link>
            <div>
              <h3 className="card-title">3D 자세 분석</h3>
              <p>
                Roll, Pitch, Yaw 데이터를 기반으로 드론의 3차원 자세를
                실시간으로 확인할 수 있습니다.
              </p>
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex flex-row items-center gap-8 md:flex-col">
          <div className="flex-1 md:text-center">
            <h1 className="mb-4 text-5xl font-bold leading-tight">
              필요한 자료만
              <br />
              골라볼 수 있도록
            </h1>
            <p className="max-w-lg text-xl text-gray-600">
              FightLog는 비행 로봇의 운행 데이터를 통합하고 분석하는
              플랫폼입니다. 비행 데이터를 시간 단위로 분석하고 관리하세요. 언제
              어디서나 드론의 상태와 비행 기록을 한눈에 확인할 수 있습니다.
            </p>
          </div>
          <div className="flex-1 md:order-last">
            <Link href="/log">
              <div className="aspect-video overflow-hidden rounded-lg shadow-md transition-all hover:scale-[1.02]">
                <img
                  src="https://www.figma.com/community/resource/ae4f91ba-cd87-44bd-88a0-7d5bd4343bfa/thumbnail"
                  className="h-full w-full object-cover"
                  alt="데이터 ui 이미지"
                />
              </div>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
