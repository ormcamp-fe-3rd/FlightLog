// import Link from "next/link";

export default function DataService() {
  return (
    <section className="mb-20">
      <div className="flex flex-row items-center gap-8 md:flex-col">
        <div className="flex-1 md:text-center">
          <h1 className="mb-4 text-5xl font-bold leading-tight">
            그래프를 통한
            <br />
            데이터 시각화 서비스
          </h1>
          <p className="max-w-lg text-xl text-gray-600">
            지도 위의 데이터 뿐만 아니라 시간별 배터리 상태, 고도, 속도 등의 정보를 그래프 상에서 비교, 분석할 수 있습니다.
          </p>
        </div>
        <div className="flex-1 md:order-last">
          {/* <Link href="/log"> */}
          <div className="aspect-video overflow-hidden rounded-lg shadow-md">
            <img
              src="/images/common/data-page.png"
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
