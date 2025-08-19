import React from "react";
import Sidebar from "./Sidebar";
import Navbar from "./Navbar";

const MainLayout: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  return (
    <div className="flex h-screen">
      <Sidebar />
      <div className="flex-1 flex flex-col">
        <Navbar />
        <main className="p-4 overflow-auto bg-gray-100 dark:bg-gray-800">{children}</main>
      </div>
    </div>
  );
};

export default MainLayout;