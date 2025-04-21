import { useState } from "react";
import Button from "./Button";

const Navbar = () => {
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <>
      <header className="flex justify-center w-full px-4 fixed z-20">
        <nav className="bg-primary text-textLight mt-4 p-4 rounded-2xl items-center w-full max-w-5xl">
          <div className="flex justify-between items-center">
            <div className="text-2xl font-black">LOGO</div>
            
            {/* Desktop Navigation */}
            <ul className="hidden md:flex space-x-6 text-sm items-center">
              <a
                href="#"
                className="text-center hover:brightness-90 transition-all"
              >
                Home
              </a>
              <a
                href="#"
                className="text-center hover:brightness-90 transition-all"
              >
                Pricing
              </a>
              <a
                href="#"
                className="text-center hover:brightness-90 transition-all"
              >
                About
              </a>
              <a
                href="#"
                className="text-center hover:brightness-90 transition-all"
              >
                Contact
              </a>
            </ul>
            
            <div className="hidden md:block">
              <Button children={undefined} color="accent" />
            </div>
            
            {/* Mobile Menu Button */}
            <button 
              className="md:hidden p-2 focus:outline-none transition-transform duration-300 ease-in-out" 
              onClick={toggleMenu}
              aria-label="Toggle menu"
              style={{ transform: isMenuOpen ? 'rotate(180deg)' : 'rotate(0deg)' }}
            >
              <svg 
                xmlns="http://www.w3.org/2000/svg" 
                className="h-6 w-6" 
                fill="none" 
                viewBox="0 0 24 24" 
                stroke="currentColor"
              >
                {isMenuOpen ? (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M6 18L18 6M6 6l12 12" 
                  />
                ) : (
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M4 6h16M4 12h16M4 18h16" 
                  />
                )}
              </svg>
            </button>
          </div>
          
          {/* Mobile Menu with Animation */}
          <div 
            className={`md:hidden overflow-hidden transition-all duration-300 ease-in-out ${
              isMenuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0"
            }`}
          >
            <ul className="flex flex-col space-y-3 pt-4">
              <a
                href="#"
                className="block py-2 px-4 hover:bg-opacity-10 hover:bg-white rounded transition-all transform transition-transform duration-200 hover:translate-x-2"
              >
                Home
              </a>
              <a
                href="#"
                className="block py-2 px-4 hover:bg-opacity-10 hover:bg-white rounded transition-all transform transition-transform duration-200 hover:translate-x-2"
              >
                Pricing
              </a>
              <a
                href="#"
                className="block py-2 px-4 hover:bg-opacity-10 hover:bg-white rounded transition-all transform transition-transform duration-200 hover:translate-x-2"
              >
                About
              </a>
              <a
                href="#"
                className="block py-2 px-4 hover:bg-opacity-10 hover:bg-white rounded transition-all transform transition-transform duration-200 hover:translate-x-2"
              >
                Contact
              </a>
              <div className="py-2 px-4">
                <Button children={undefined} color="accent" />
              </div>
            </ul>
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;