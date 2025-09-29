import { Outlet } from "react-router-dom";
import SideNav from "./SideNav";

export default function AppLayout() {
  return (
    <div className="flex min-h-dvh">
      <div
        className="sticky top-0 z-10 w-40 h-dvh bg-stone-50 shrink-0 border-r border-white/5
  shadow-[12px_0_24px_-30px_rgba(0,0,0,0.6)]"
      >
        <SideNav />
      </div>
      {/* Main column */}
      <div className="z-0 flex-1 flex flex-col bg-slate-50 p-4">
        <Outlet />
      </div>
    </div>
  );
}
