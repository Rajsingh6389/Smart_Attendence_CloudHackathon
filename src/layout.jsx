import { Outlet } from "react-router-dom";
import Navbar from "./Home/Navbar";
import Footer from "./Home/Footer";

const Layout = () => {
  return (
    // min-h-screen ensures the container is at least the height of the window
    <div className="flex flex-col min-h-screen bg-[#050505] selection:bg-cyan-500/30">
      
      {/* Fixed Navbar - stays at the top */}
      <div className="fixed top-0 left-0 w-full z-50">
        <Navbar />
      </div>

      {/* Main Content Area - Outlet
          flex-grow makes this section expand to fill available vertical space
          pt-20 matches your navbar height so content starts below it
      */}
      <main className="flex-grow pt-20 pb-20 md:pt-24 relative">
        <Outlet />
      </main>

      {/* Footer - will always be at the bottom of the content */}
      <Footer />
    </div>
  );
};

export default Layout;