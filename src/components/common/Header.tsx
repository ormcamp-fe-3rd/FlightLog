import Link from "next/link";

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between bg-black p-4 text-white">
      <div className="flex items-center gap-5">
        <button className="hidden size-5 md:block">
          <img src="/images/map/icon-menu.svg" alt="Toggle sidebar" />
        </button>
        <Link href="/" className="cursor-pointer text-2xl font-bold">
          FlightLog
        </Link>
      </div>
      <Link href="/login">Login</Link>
    </header>
  );
}
