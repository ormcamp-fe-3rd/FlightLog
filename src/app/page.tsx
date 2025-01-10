import ServiceStart from "@/components/home/ServiceStart";
import ImageGallery from "@/components/home/ImageGallery";
import ServiceTitle from "@/components/home/ServiceTitle";
import Cards from "@/components/home/Cards";
import DataService from "@/components/home/DataService";

export default function Home() {
  return (
    <div className="mx-auto max-w-7xl break-keep px-4 py-12">
      <ServiceStart />
      <ImageGallery />
      <ServiceTitle />
      <Cards />
      <DataService />
    </div>
  );
}
