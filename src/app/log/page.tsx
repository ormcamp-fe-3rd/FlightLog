import Sidebar from "@/components/common/Sidebar";
import MultipleAxesCharts from "@/components/log/charts/MultipleAxesCharts";
import SynchronisedCharts from "@/components/log/charts/SynchronisedCharts";
import Test from "@/components/log/charts/Test";

export default function LogPage() {
  return (
    <div className="flex">
      <Sidebar />
      <div className="block">
        <Test></Test>
      </div>
    </div>
  );
}
