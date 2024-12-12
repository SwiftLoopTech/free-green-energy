import Link from "next/link";

const Navbar: React.FC = () => {
  return (
    <nav className="py-4 px-6">
      <div className="flex items-center justify-between">
        {/* Company logo */}
        <div>
          <Link href="/">
            <img
              src="/images/fge-logo.png"
              alt="Company Logo"
              className="h-8"
            />
          </Link>
        </div>

        {/* Navigation links */}
        <ul className="flex gap-12">
          <li>
            <Link href="/">Home</Link>
          </li>
          <li>
            <Link href="/homeowners">Homeowners</Link>
          </li>
          <li>
            <Link href="/business-owners">Business owners</Link>
          </li>
          <li>
            <Link href="/support">Support</Link>
          </li>
        </ul>

        {/* Get our product button */}
        <button className="btn-primary">Get our product</button>
      </div>
    </nav>
  );
};

export default Navbar;
