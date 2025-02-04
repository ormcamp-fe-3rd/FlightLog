// import Link from "next/link";

export default function DataService() {
  return (
    <section className="mb-20">
      <div className="flex flex-row items-center gap-8 md:flex-col">
        <div className="flex-1 md:text-center">
          <h1 className="mb-4 text-5xl font-bold leading-tight">
            필요한 자료만
            <br />
            골라볼 수 있도록
          </h1>
          <p className="max-w-lg text-xl text-gray-600">
            FightLog는 비행 로봇의 운행 데이터를 통합하고 분석하는 플랫폼입니다.
            비행 데이터를 시간 단위로 분석하고 관리하세요. 언제 어디서나 드론의
            상태와 비행 기록을 한눈에 확인할 수 있습니다.
          </p>
        </div>
        <div className="flex-1 md:order-last">
          {/* <Link href="/log"> */}
          <div className="aspect-video overflow-hidden rounded-lg shadow-md">
            <img
              src="https://png.pngtree.com/png-clipart/20221219/original/pngtree-ui-dashboard-chart-diagram-graph-png-image_8777649.png"
              className="h-full w-full object-cover"
              alt="데이터 ui 이미지"
            />
          </div>
          {/* </Link> */}
        </div>
      </div>
    </section>
  );
}
