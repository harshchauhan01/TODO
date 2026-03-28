import { useState } from "react";
import { MdMenu, MdClose } from "react-icons/md";
import LoginPage from "./Login";
import { NavLink } from "react-router-dom";
import { createPortal } from "react-dom";
import {useAuth} from "../hooks/useAuth";
import toast from "react-hot-toast";


const Navbar = () => {
  const [open, setOpen] = useState(false);
  const [openModel, setOpenModel] = useState(false);
  const handleLogin=()=>{
    setOpenModel(true);
  };

  const {logout} = useAuth();

  const handleLogout=()=>{
    logout();
    toast.success("Logout Successfully");
  };


  const isLoggedIn = !!localStorage.getItem("access");
  const navLinks = [
    { to: "/", label: "Home" },
    { to: "/todo", label: "Tasks" },
    { to: "/clock", label: "Clock" },
  ];

  const loginModal = openModel ? (
    <div
      className="fixed inset-0 z-[120] flex items-start justify-center overflow-y-auto bg-slate-900/45 p-4 pt-8 backdrop-blur-sm sm:items-center sm:pt-4"
      onClick={()=>setOpenModel(false)}
    >
      <div
        className="relative w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-1 shadow-2xl sm:max-h-[90vh]"
        onClick={(e)=>{e.stopPropagation()}}
      >
        <button
          onClick={() => setOpenModel(false)}
          className="absolute right-4 top-3 z-10 rounded-md px-2 py-1 text-slate-500 transition hover:bg-slate-100 hover:text-slate-900"
        >
          x
        </button>
        <LoginPage onAuthSuccess={()=>setOpenModel(false)}/>
      </div>
    </div>
  ) : null;


  return (
    <header className="sticky top-0 z-40 px-4 py-4 sm:px-6">
      <nav className="glass-panel page-wrap rounded-2xl px-5 py-3 rise-in">
        <div className="flex items-center justify-between gap-4">
          <NavLink to="/" className="text-xl font-bold tracking-tight text-slate-900">
            Task Atlas
          </NavLink>

          <div className="hidden md:flex items-center gap-2 rounded-xl bg-white/70 p-1 soft-border">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white shadow"
                      : "text-slate-600 hover:bg-slate-100 hover:text-slate-900"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
          </div>

          <div className="flex items-center gap-2">
            {isLoggedIn ? (
              <button
                className="hidden md:block rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-sm font-semibold text-rose-700 transition hover:bg-rose-100"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="hidden md:block rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition hover:bg-slate-700"
                onClick={handleLogin}
              >
                Login
              </button>
            )}

            <button
              className="md:hidden rounded-lg bg-white/80 p-2 text-2xl text-slate-700 soft-border"
              onClick={() => setOpen(!open)}
              aria-label="Toggle navigation menu"
            >
              {open ? <MdClose /> : <MdMenu />}
            </button>
          </div>
        </div>

        {open && (
          <div className="mt-4 flex flex-col gap-2 rounded-xl bg-white/90 p-3 md:hidden soft-border">
            {navLinks.map((link) => (
              <NavLink
                key={link.to}
                to={link.to}
                className={({ isActive }) =>
                  `rounded-lg px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-slate-900 text-white"
                      : "text-slate-700 hover:bg-slate-100"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {link.label}
              </NavLink>
            ))}
            {isLoggedIn ? (
              <button
                className="mt-1 rounded-lg border border-rose-200 bg-rose-50 px-4 py-2 text-left text-sm font-semibold text-rose-700"
                onClick={handleLogout}
              >
                Logout
              </button>
            ) : (
              <button
                className="mt-1 rounded-lg bg-slate-900 px-4 py-2 text-left text-sm font-semibold text-white"
                onClick={handleLogin}
              >
                Login
              </button>
            )}
          </div>
        )}
      </nav>
      {typeof document !== "undefined" && createPortal(loginModal, document.body)}
    </header>
  );
};

export default Navbar;