import Sidebar from "@/components/common/Sidebar";
import MultipleAxesCharts from "@/components/log/charts/MultipleAxesCharts";
import AttitudeCharts from "@/components/log/charts/AttitudeCharts";
import StatusCharts from "@/components/log/charts/StatusCharts";

export default function LogPage() {
  return (
    <div className="block">
      <MultipleAxesCharts />
      <StatusCharts></StatusCharts>
      <AttitudeCharts />
    </div>
  );
}
