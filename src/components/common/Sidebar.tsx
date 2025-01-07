import Link from "next/link";

export default function Sidebar() {
  return (
    <aside className="h-[calc(100vh-56px)] w-60 border-r bg-white">
      <div className="p-4">
        <h2>Pages</h2>
        <nav>
          <Link href="/map" className="block pl-4">
            Map
          </Link>
          <Link href="/log" className="block pl-4">
            LogPage
          </Link>
        </nav>
      </div>
    </aside>
  );
}
