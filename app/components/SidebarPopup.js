import { useState } from 'react';
import { Gamepad2, FolderHeart, Award, Menu, X } from 'lucide-react';

export default function SidebarPopup() {
  const [isOpen, setIsOpen] = useState(false);

  const toggleSidebar = () => {
    setIsOpen(!isOpen);
  };

  const navigateTo = (path) => {
    // In a real implementation, you might use router navigation
    // This is a placeholder for demonstration
    console.log(`Navigating to: ${path}`);
    // Example with window.location:
    // window.location.href = path;
   
    // Close the sidebar after navigation
    setIsOpen(false);
  };

  return (
    <>
      {/* Hamburger Button */}
      <button
        onClick={toggleSidebar}
        className="fixed top-4 left-4 p-2 rounded-md text-white z-50"
        aria-label="Toggle menu"
      >
        {isOpen ? <X size={24} /> : <Menu size={24} />}
      </button>

      {/* Overlay - only visible when sidebar is open, but now without blur */}
      {isOpen && (
        <div
          className="fixed inset-0  bg-opacity-30 z-40"
          onClick={toggleSidebar}
        />
      )}

      {/* Sidebar with contained glass effect */}
      <div className={`fixed top-0 left-0 h-screen w-64 backdrop-blur-md text-white p-4 z-50 transform transition-transform duration-300 ease-in-out border-r border-white border-opacity-10 ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
        {/* Close button at the top */}
        <div className="absolute top-4 right-4">
          <button 
            onClick={toggleSidebar}
            className="p-1.5 rounded-full hover:bg-background hover:bg-opacity-20 transition-all"
            aria-label="Close menu"
          >
            <X size={20} />
          </button>
        </div>

        <div className="mb-8 pt-8">
          <h1 className="text-xl font-bold">GameHub</h1>
        </div>
       
        <nav className="flex-1">
          <ul className="space-y-2">
            {/* Games Page */}
            <li>
              <button
                onClick={() => navigateTo('/games')}
                className="w-full flex items-center p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-left"
              >
                <Gamepad2 className="mr-3" size={20} />
                <span className="font-medium">Games Page</span>
              </button>
            </li>
           
            {/* Collections */}
            <li>
              <button
                onClick={() => navigateTo('/collections')}
                className="w-full flex items-center p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-left"
              >
                <FolderHeart className="mr-3" size={20} />
                <span className="font-medium">Collections</span>
              </button>
            </li>
           
            {/* Best Of Year */}
            <li>
              <button
                onClick={() => navigateTo('/best-of-year')}
                className="w-full flex items-center p-3 rounded-lg hover:bg-white hover:bg-opacity-10 transition-all text-left"
              >
                <Award className="mr-3" size={20} />
                <span className="font-medium">Best Of Year</span>
              </button>
            </li>
          </ul>
        </nav>
      </div>
    </>
  );
}