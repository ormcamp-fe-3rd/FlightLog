import Link from "next/link";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl break-keep px-4 py-12">
      <section className="mb-20">
        <div className="flex flex-row items-center gap-8 md:flex-col">
          <div className="flex-1 md:text-center">
            <h1 className="mb-4 text-6xl font-bold">
              One login.
              <br />
              Full visibility.
            </h1>
            <p className="text-xl text-gray-600">
              DroneDeploy는 모든 현실 캡처 소스의 데이터를 통합하고 분석하는
              유일한 플랫폼입니다. 전체 자산 수명 주기에 걸친 통합 사진 문서화의
              이점을 누리세요. 어디서든 - 전 세계 어디에서나 여러 현장과 위치를
              모니터링하세요.
            </p>
          </div>
          <div className="flex-1 md:order-last">
            <div className="aspect-video overflow-hidden rounded-lg shadow-xl">
              <img
                src="/images/home/flight-log-main-image.jpg"
                className="h-full w-full object-cover"
              />
            </div>
          </div>
        </div>
      </section>

      <section className="mb-20 text-center">
        <h1 className="mb-4 text-5xl font-bold">비행 데이터 분석 플랫폼</h1>
        <p className="mb-5 text-xl">
          드론의 비행 데이터를 시각화하여 효율적인 분석을 제공합니다.
        </p>
        <div className="flex justify-center">
          <Link href="/map" className="btn">
            시작하기
          </Link>
        </div>
      </section>

      <section className="mb-20">
        <div className="flex flex-row gap-8 md:flex-col md:gap-4">
          <div className="card flex-1 md:w-full">
            <Link href="/log">
              <div className="mb-4 flex aspect-video cursor-pointer rounded-lg bg-gray-300 shadow-md transition-all hover:scale-[1.02]"></div>
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
                  alt="드론 이미지"
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
                  alt="드론 이미지"
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

      {/* <section className="mb-20">
        <div className="flex h-48 flex-row gap-8 md:flex-col md:gap-4">
          <div className="h-full w-full flex-1 overflow-hidden rounded-lg bg-gray-300 shadow-md">
            <img
              className="h-full w-full object-cover"
              src="https://www.highcharts.com/demo/images/samples/highcharts/demo/accessible-line/thumbnail.svg"
            />
          </div>
          <div className="flex-1">
            <h2 className="mb-4 text-3xl font-bold">상세 데이터 분석</h2>
            <p className="mb-4">
              비행 중 수집된 모든 텔레메트리 데이터를 상세하게 분석하고
              시각화합니다.
            </p>
            <ul>
              <li>위성 연결 상태</li>
              <li>배터리 상태 모니터링</li>
              <li>비행 고도 및 속도</li>
              <li>실시간 위치 정보</li>
            </ul>
          </div>
        </div>
      </section> */}
    </div>
  );
}
