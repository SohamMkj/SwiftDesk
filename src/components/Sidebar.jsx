import { Link, useLocation, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import { FaTicketAlt, FaSun, FaRegMoon, FaBars, FaTimes } from "react-icons/fa";
import { MdDashboard } from "react-icons/md";
import { TbDragDrop } from "react-icons/tb";
import logo from "../assets/ticketLogo.png";

export default function Sidebar() {
  const location = useLocation();
  const navigate = useNavigate();
  const [darkMode, setDarkMode] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("theme") === "dark") {
      document.documentElement.classList.add("dark");
      setDarkMode(true);
    }
  }, []);

  // useEffect(() => {
  //   if (isOpen) {
  //     document.body.classList.add("overflow-hidden");
  //   } else {
  //     document.body.classList.remove("overflow-hidden");
  //   }
  //   return () => document.body.classList.remove("overflow-hidden");
  // }, [isOpen]);

  const toggleTheme = () => {
    if (darkMode) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setDarkMode(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setDarkMode(true);
    }
  };

  const navItems = [
    { path: "/", label: "Dashboard", icon: <MdDashboard className="size-5" /> },
    {
      path: "/ticket",
      label: "Ticket",
      icon: <FaTicketAlt className="size-5" />,
    },
    {
      path: "/ticketboard",
      label: "Ticket Board",
      icon: <TbDragDrop className="size-5" />,
    },
  ];

  return (
    <>
      {!isOpen && (
        <div className="md:hidden fixed top-4 right-2 ml-1 z-50">
          <button
            onClick={() => setIsOpen(true)}
            className="p-2 text-white bg-primary rounded-md shadow"
          >
            <FaBars size={12} />
          </button>
        </div>
      )}

      <div
        className={`fixed top-0 md:left-0 right-0 h-full bg-app flex flex-col justify-between transform transition-transform duration-500 ease-in-out z-40 w-[70%]
  ${isOpen ? "translate-x-0" : "translate-x-full"}
  md:translate-x-0 md:w-25 bg-[var(--color-sidebar)]`}
      >
        <div>
          <div className="flex items-center justify-between h-20 mx-3 px-3">
            <img
              onClick={() => {
                navigate("/");
                setIsOpen(false);
              }}
              src={logo}
              alt="Logo"
              className="md:h-10 h-8 md:w-12 w-10 rounded-lg bg-white md:p-2 p-1 shadow hover:cursor-pointer"
            />
            <button
              onClick={() => setIsOpen(false)}
              className="md:hidden text-gray-400 hover:text-white"
            >
              <FaTimes size={25} />
            </button>
          </div>

          <nav className="mt-4 flex flex-col gap-4 md:gap-6 justify-center mx-auto">
            {navItems.map((item) => (
              <Link
                key={item.path}
                to={item.path}
                onClick={() => setIsOpen(false)}
                className={`flex items-center md:flex-col md:justify-center justify-start gap-2 mx-2 px-3 py-3 rounded-lg transition
          ${
            location.pathname === item.path
              ? "bg-primary text-white font-semibold"
              : "text-gray-400 hover:bg-orange-800 hover:text-white"
          }`}
              >
                {item.icon}
                <span className="text-xs sm:text-sm text-nowrap">
                  {item.label}
                </span>
              </Link>
            ))}
          </nav>
        </div>

        <div className="flex flex-col items-center gap-6 p-4 transition-colors duration-500 ease-in-out">
          <button
            onClick={toggleTheme}
            className="flex items-center justify-center w-10 h-10 rounded-lg text-white bg-primary hover:cursor-pointer transition-colors duration-500 ease-in-out"
          >
            <span key={darkMode} className="animate-fadeRotate">
              {darkMode ? <FaSun /> : <FaRegMoon />}
            </span>
          </button>
        </div>
      </div>

      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-20 z-30 md:hidden backdrop-blur-md"
          onClick={() => setIsOpen(false)}
        />
      )}
    </>
  );
}
