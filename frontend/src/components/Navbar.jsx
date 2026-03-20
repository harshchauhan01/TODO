import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";


const Navbar = () => {
  const [open, setOpen] = useState(false);

  return (
    <nav className="bg-white shadow-md px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Todo</h1>
        
        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          <a href="#" className="hover:text-blue-500">Home</a>
          <a href="#" className="hover:text-blue-500">Tasks</a>
          <a href="#" className="hover:text-blue-500">About</a>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600">
            Login
          </button>

          <button
            className="md:hidden text-2xl"
            onClick={() => setOpen(!open)}
          >
            {open ? <MdClose /> : <MdMenu />}
          </button>
        </div>
      </div>

      {open && (
        <div className="mt-4 flex flex-col gap-4 text-gray-600 md:hidden">
          <a href="#">Home</a>
          <a href="#">Tasks</a>
          <a href="#">About</a>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg">
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;