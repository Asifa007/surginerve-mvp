import { Outlet } from "react-router-dom";
import AppSidebar from "@/components/AppSidebar";
import Navbar from "@/components/Navbar";

const DashboardLayout = () => {
  return (
    <div className="flex min-h-screen w-full bg-background">
      <AppSidebar />
      <div className="flex flex-1 flex-col">
        <Navbar />
        <main className="flex-1 overflow-auto p-6">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default DashboardLayout;
