import Link from "next/link";

export default function Header() {
  return (
    <header className="flex h-14 items-center justify-between bg-black p-4 text-white">
      <Link href="/" className="cursor-pointer">
        FlightLog
      </Link>
      <Link href="/login">Login</Link>
    </header>
  );
}
