import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import LoginPage from "./Login";
import { Link } from "react-router-dom";

const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const handleLogin=()=>{
    setOpenModel(true);
  };
  return (
    <nav className="bg-white shadow-md px-6 py-3">
      <div className="flex items-center justify-between">
        <h1 className="text-xl font-bold text-gray-800">Todo</h1>
        
        <div className="hidden md:flex gap-6 text-gray-600 font-medium">
          <Link to="/" className="hover:text-blue-500">Home</Link>
          <Link to="/todo" className="hover:text-blue-500">Tasks</Link>
          <Link to="/" className="hover:text-blue-500">About</Link>
        </div>

        <div className="flex items-center gap-3">
          <button className="hidden md:block bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600" onClick={handleLogin}>
            Login
          </button>

          {openModel && (
            <div className="fixed inset-0 bg-black/50 bg-opacity-50 flex items-center justify-center z-50" onClick={()=>setOpenModel(false)}>
              <div className="bg-white rounded-lg w-116 relative" onClick={(e)=>{e.stopPropagation()}}>
                <button
                  onClick={() => setOpenModel(false)}
                  className="absolute top-3 right-3 text-gray-500 hover:text-black"
                >
                  ✕
                </button>
                <LoginPage onAuthSuccess={()=>setOpenModel(false)}/>
              </div>
            </div>

          )}

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
          <Link to="/">Home</Link>
          <Link to="/todo">Tasks</Link>
          <Link to="/">About</Link>
          <button className="bg-blue-500 text-white px-4 py-2 rounded-lg" onClick={handleLogin}>
            Login
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;