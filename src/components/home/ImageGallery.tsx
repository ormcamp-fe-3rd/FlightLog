export default function ImageGallery() {
  return (
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
  );
}
