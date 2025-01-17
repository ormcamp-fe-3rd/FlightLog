import Sidebar from "@/components/common/Sidebar";
import MultipleAxesCharts from "@/components/log/charts/MultipleAxesCharts";
import SynchronisedCharts from "@/components/log/charts/SynchronisedCharts";

export default function LogPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="block">
        <MultipleAxesCharts />
        <SynchronisedCharts numOfDatasets={2} />
      </div>
    </div>
  );
}
