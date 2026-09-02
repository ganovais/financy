import { Outlet } from "react-router";

import { Navbar } from "@/components/navbar";

export function AppLayout() {
  return (
    <>
      <Navbar />
      <main className="px-12 py-12">
        <div className="mx-auto w-full max-w-[1280px]">
          <Outlet />
        </div>
      </main>
    </>
  );
}
