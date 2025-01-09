import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="flex h-[calc(100vh-56px)] w-60 flex-col gap-5 border-r bg-white p-4 text-lg">
      <div className="flex flex-col gap-5">
        <h2 className="font-bold">Pages</h2>
        <nav className="flex flex-col gap-5 pl-4">
          <Link href="/map" className="flex gap-4">
            <img src="/images/common/icon-map.svg" alt="Map page" />
            <span>Map</span>
          </Link>
          <Link href="/log" className="flex gap-4">
            <img src="/images/common/icon-pie-chart.svg" alt="Log page" />
            <span>LogPage</span>
          </Link>
        </nav>
      </div>
      <hr className="border-[#D9D9D9]" />
      <div className="flex flex-col gap-5">
        <h2 className="font-bold">Operations</h2>
        <div className="flex flex-col gap-4">
          <div>Robot1</div>
          <div className="flex flex-col pl-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-sm"
              />
              <span className="">operation1</span>
            </label>
          </div>
          <div className="flex flex-col pl-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-sm"
              />
              <span className="">operation2</span>
            </label>
          </div>
        </div>
        <div className="flex flex-col gap-4">
          <div>Robot2</div>
          <div className="flex flex-col pl-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-sm"
              />
              <span className="">operation1</span>
            </label>
          </div>
          <div className="flex flex-col pl-4">
            <label className="flex cursor-pointer items-center gap-3">
              <input
                type="checkbox"
                defaultChecked
                className="checkbox checkbox-sm"
              />
              <span className="">operation2</span>
            </label>
          </div>
        </div>
      </div>
    </aside>
  );
}
