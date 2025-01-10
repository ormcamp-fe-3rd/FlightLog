import Link from "next/link";

export default function ServiceStart() {
  return (
    <section className="mb-7">
      <div className="flex flex-row items-center gap-8 md:flex-col">
        <div className="flex-1 md:text-center">
          <h1 className="mb-4 text-5xl font-bold leading-tight">
            드론 비행의
            <br />
            모든 것을 한눈에
          </h1>
          <p className="mb-4 max-w-lg text-xl text-gray-600">
            FightLog는 비행 로봇의 운행 데이터를 통합하고 분석하는 플랫폼입니다.
            비행 데이터를 시간 단위로 분석하고 관리하세요. 언제 어디서나 드론의
            상태와 비행 기록을 한눈에 확인할 수 있습니다.
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
  );
}
