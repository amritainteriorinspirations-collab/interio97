"use client";

import { useRef, useState } from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function ClientLayout({ categories, user, children }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const toggleRef = useRef();


  return (
    <><div className="relative">
      <Header user={user} open={sidebarOpen} setOpen={setSidebarOpen} toggleRef={toggleRef}/>
      <Sidebar user={user} open={sidebarOpen} setOpen={setSidebarOpen} toggleRef={toggleRef}/>
      <main className="mt-16 mx-auto px-3 py-8 flex flex-col flex-1">
        {children}
      </main>
      <Footer />
    </div>
    </>
  );
}
