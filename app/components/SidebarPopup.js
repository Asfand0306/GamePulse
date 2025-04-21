
import { useState } from 'react';
import { Gamepad2, FolderHeart, Award, Menu, X } from 'lucide-react';

export default function SidebarPopup({ isOpen, setIsOpen }) {
  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (path) => {
    console.log(`Navigating to: ${path}`);
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
      <div className={`fixed top-0 left-0 h-full w-64 bg-background backdrop-blur-md text-white p-4 z-40 transform transition-transform duration-300 ease-in-out border-r border-white border-opacity-10 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-xl font-bold">GamePulse</h1>
          <button 
            onClick={() => setIsOpen(false)}
            className="p-1 rounded-md hover:bg-white/10 transition-colors"
          >
            <X size={20} />
          </button>
        </div>

        <nav className="flex-1">
          <ul className="space-y-2">
            {/* Games Page */}
            <li>
              <button
                onClick={() => navigateTo('/games')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                <Gamepad2 size={20} />
                <span className="font-medium">Games Page</span>
              </button>
            </li>

            {/* Collections */}
            <li>
              <button
                onClick={() => navigateTo('/collections')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                <FolderHeart size={20} />
                <span className="font-medium">Collections</span>
              </button>
            </li>

            {/* Best Of Year */}
            <li>
              <button
                onClick={() => navigateTo('/best-of-year')}
                className="w-full flex items-center space-x-3 p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all"
              >
                <Award size={20} />
                <span className="font-medium">Best Of Year</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}