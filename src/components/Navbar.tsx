import Button from "./Button";

const Navbar = () => {
  return (
    <>
      <header className="flex justify-center">
        <nav className="bg-primary grid grid-cols-3 text-textLight  mt-4 p-4 rounded-2xl items-center fixed w-full max-w-5xl mx-16">
          <div className="text-2xl font-black">LOGO</div>
          <ul className="grid grid-cols-4 space-x-1 text-sm       items-center">
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
          <div className="flex justify-end">
            <Button children={undefined} color={"accent"} />
          </div>
        </nav>
      </header>
    </>
  );
};

export default Navbar;
