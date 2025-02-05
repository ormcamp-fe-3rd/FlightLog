import Sidebar from "@/components/common/Sidebar";
import MultipleAxesCharts from "@/components/log/charts/MultipleAxesCharts";
import AttitudeCharts from "@/components/log/charts/AttitudeCharts";
import StatusCharts from "@/components/log/charts/StatusCharts";

export default function LogPage() {
  return (
    <div className="flex w-full flex-col gap-8 overflow-y-auto bg-zinc-100 p-6">
      <div className="w-full">
        <MultipleAxesCharts />
      </div>
      <div className="w-full">
        <StatusCharts />
      </div>
      <div className="w-full">
        <AttitudeCharts />
      </div>
    </div>
  );
}
