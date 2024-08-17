import React from "react";
import Sidebar from "./Sidebar";
const Layout = ({ children }) => {
    return (
        <div className="flex h-screen">
            <Sidebar />
            <div className="flex-1 p-10 text-2xl font-bold bg-gray-100 overflow-auto">
                {children}
            </div>
        </div>
    );
};

export default Layout;
