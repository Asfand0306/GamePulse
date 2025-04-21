import { useState } from "react";
import { Gamepad2, FolderHeart, Award, Menu, X } from "lucide-react";
import Link from "next/link";

export default function SidebarPopup({ isOpen, setIsOpen }) {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const closeSidebar = () => {
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button - Moved to be part of the component but positioned relative */}
      <button
        onClick={toggleSidebar}
        className="flex items-center justify-center p-2 rounded-md bg-purple-800 hover:bg-purple-700 transition-colors"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={20} /> : <Menu size={20} />}
      </button>

      {/* Overlay that appears when sidebar is open */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-opacity-50 z-30"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar with contained glass effect */}
      <div
        className={`fixed top-0 left-0 h-full w-72 bg-background/95 backdrop-blur-sm text-white p-4 z-40 transform transition-transform duration-300 ease-in-out border-r border-white border-opacity-10 ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex flex-col items-center mb-8 pt-4">
          <div className="flex justify-between items-center w-full mb-4">
            <div className="w-6"></div> {/* Empty div for spacing */}
            <h1 className="text-3xl font-bold text-center">GamePulse</h1>
            <button
              onClick={() => setIsOpen(false)}
              className="p-1 rounded-md hover:bg-white/10 transition-colors"
            >
              <X size={20} />
            </button>
          </div>
          <div className="h-px w-full bg-white/10 mt-2"></div>
        </div>

        <nav className="flex-1">
          <ul className="space-y-4">
            {/* Games Page */}
            <li>
              <button
                onClick={() => navigateTo("/games")}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-700 hover:text-white transition-all"
              >
                <Gamepad2 size={20} />
                <span className="font-medium">Games Page</span>
              </button>
            </li>

            {/* Collections */}
            <li>
              <button
                onClick={() => navigateTo("/collections")}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-700 hover:text-white transition-all"
              >
                <FolderHeart size={20} />
                <span className="font-medium">Collections</span>
              </button>
            </li>

            {/* Best Of Year */}
            <li>
              <Link
                href="./best-of-year"
                onClick={closeSidebar}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-purple-700 hover:text-white transition-all"
              >
                <Award size={20} />
                <span className="font-medium">Best Of Year</span>
              </Link>
            </li>
          </ul>
        </nav>

        {/* Footer section */}
        <div className="mt-auto pt-6">
          <div className="h-px w-full bg-white/10 mb-4"></div>
          <p className="text-sm text-gray-400 text-center">GamePulse © 2025</p>
        </div>
      </div>
    </>
  );
}
