import { useState } from "react";
import { Menu, X } from "lucide-react";
import { Link } from 'react-router-dom';

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <nav className="bg-[#0d0f1d] text-white px-6 py-4 shadow-lg fixed top-0 w-full z-50 font-sans">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        {/* Logo */}
        <h1 className="text-3xl font-extrabold text-purple-400 tracking-wider pl-2">
          MycoScan
        </h1>

        {/* Desktop Nav Links */}
        <ul className="hidden md:flex gap-8 text-base lg:text-lg font-medium">
          <li><Link to="/" className="hover:text-purple-300 transition-all duration-200">Home</Link></li>
          <li><Link to="/prediction" className="hover:text-purple-300 transition-all duration-200">Prediction</Link></li>
          <li><Link to="/mycology" className="hover:text-purple-300 transition-all duration-200">Mycology</Link></li>
          <li><Link to="/safety-guide" className="hover:text-purple-300 transition-all duration-200">Safety Guide</Link></li>
        </ul>

        {/* Toggle Button for Mobile */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="md:hidden text-purple-300"
        >
          {isOpen ? <X size={30} /> : <Menu size={30} />}
        </button>
      </div>

      {/* Mobile Dropdown Menu */}
      {isOpen && (
        <ul className="md:hidden mt-4 flex flex-col gap-4 bg-[#0d0f1d] px-6 py-4 rounded-lg shadow-md text-base font-medium">
          <li><Link to="/" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition">Home</Link></li>
          <li><Link to="/prediction" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition">Prediction</Link></li>
          <li><Link to="/mycology" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition">Mycology</Link></li>
          <li><Link to="/safety-guide" onClick={() => setIsOpen(false)} className="hover:text-purple-300 transition">Safety Guide</Link></li>
        </ul>
      )}
    </nav>
  );
}
