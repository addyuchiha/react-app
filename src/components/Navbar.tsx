import Button from "./Button";

const Navbar = () => {
  return (
    <>
      <header className="flex justify-center">
        <nav className="bg-primary grid grid-cols-3 text-white max-w-3xl mx-auto mt-2 p-4 rounded-2xl items-center fixed">
          <div className="text-2xl font-black">LOGO</div>
          <ul className="grid grid-cols-4 space-x-1 text-sm       items-center">
            <a
              href="#"
              className="text-center hover:text-gray-300 transition-colors"
            >
              Home
            </a>
            <a
              href="#"
              className="text-center hover:text-gray-300 transition-colors"
            >
              Pricing
            </a>
            <a
              href="#"
              className="text-center hover:text-gray-300 transition-colors"
            >
              About
            </a>
            <a
              href="#"
              className="text-center hover:text-gray-300 transition-colors"
            >
              Contact
            </a>
          </ul>
          <div className="flex justify-end">
            <Button />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
