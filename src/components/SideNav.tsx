import { useNavigate, useLocation, NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import {
  CircleUser,
  HouseHeart,
  TreePalm,
  Users,
  ClipboardClock,
} from "lucide-react";

export default function SideNav() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err: unknown) {
      console.error("Logout failed", err);
    }
  };

  return (
    <aside className="h-dvh w-full flex flex-col px-1">
      <h1 className="font-bold px-2 py-4">Team Scheduler</h1>
      <div className="flex-1 flex flex-col gap-1">
        <NavLink
          to="dashboard"
          className={`cursor-pointer text-neutral-700 flex gap-2 rounded-md p-2 border hover:border-slate-400 ${
            location.pathname.startsWith("/dashboard") ? "bg-slate-200" : ""
          }`}
        >
          <HouseHeart />
          home
        </NavLink>
        <NavLink
          to="vacation"
          className={`cursor-pointer text-neutral-700 flex gap-2 rounded-md p-2 border hover:border-slate-400 ${
            location.pathname.startsWith("/vacation") ? "bg-slate-200" : ""
          }`}
        >
          <TreePalm />
          vacation
        </NavLink>
        <NavLink
          to="members"
          className={`cursor-pointer text-neutral-700 flex gap-2 rounded-md p-2 border hover:border-slate-400 ${
            location.pathname.startsWith("/members") ? "bg-slate-200" : ""
          }`}
        >
          <Users />
          members
        </NavLink>
        <NavLink
          to="rotations"
          className={`cursor-pointer text-neutral-700 flex gap-2 rounded-md p-2 border hover:border-slate-400 ${
            location.pathname.startsWith("/rotations") ? "bg-slate-200" : ""
          }`}
        >
          <ClipboardClock />
          rotations
        </NavLink>
      </div>

      <div className="p-2 border-t flex justify-between items-center">
        <span className="text-neutral-700">
          <CircleUser />
        </span>
        <button
          className="rounded-md px-4 py-1 bg-blue-700 hover:bg-blue-800 text-neutral-100"
          onClick={handleLogout}
        >
          log out
        </button>
      </div>
    </aside>
  );
}
