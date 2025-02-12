import { Link } from "react-router-dom";
import { Search, User, ShoppingCart } from "lucide-react";

const Navbar = () => {
  return (
    <nav className="bg-brand-primary py-4 px-6 fixed w-full top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto flex items-center justify-between">
        <Link to="/" className="text-white text-2xl font-semibold hover:opacity-90 transition-opacity">
          flyease
        </Link>
        
        <div className="hidden md:flex items-center space-x-8">
          <NavLink href="/">Home</NavLink>
          <NavLink href="/flights">Flights</NavLink>
          <NavLink href="/travel-plan">Travel Plan</NavLink>
          <NavLink href="/chat-bot">Chat Bot</NavLink>
        </div>

        <div className="flex items-center space-x-6">
          <button className="text-white hover:opacity-80 transition-opacity">
            <Search className="w-5 h-5" />
          </button>
          <button className="text-white hover:opacity-80 transition-opacity">
            <User className="w-5 h-5" href="/account"/>
          </button>
          <button className="text-white hover:opacity-80 transition-opacity">
            <ShoppingCart className="w-5 h-5" href="shopping-cart"/>
          </button>
        </div>
      </div>
    </nav>
  );
};

const NavLink = ({ href, children }: { href: string; children: React.ReactNode }) => (
  <Link
    to={href}
    className="text-white hover:opacity-80 transition-opacity text-sm font-medium"
  >
    {children}
  </Link>
);

export default Navbar;