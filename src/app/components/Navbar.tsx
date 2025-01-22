import Link from 'next/link';

export default function Navbar() {
  return (
    <nav className="p-4 shadow-sm">
      <div className="container mx-auto flex justify-between items-center">
        <Link href="/" className="text-xl font-bold">
          Image Generator
        </Link>
        <div className="space-x-4">
          <Link href="/" className="hover:text-gray-600">
            Home
          </Link>
          <Link href="/history" className="hover:text-gray-600">
            History
          </Link>
        </div>
      </div>
    </nav>
  );
}
