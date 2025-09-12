import { Outlet } from "react-router-dom";
import Navbar from "./Navbar";

export default function AppLayout() {
  return (
    <>
      <div className="m-4">
        <Navbar />
        <Outlet />
      </div>
    </>
  );
}
