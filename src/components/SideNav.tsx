import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { CircleUser } from "lucide-react";

export default function SideNav() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await logout();
      navigate("/login");
    } catch (err: unknown) {
      console.error("Logout failed", err);
    }
  };

  return (
    <div className="w-full h-full">
      <h1 className="p-2">Team Scheduler</h1>
      <div className="h-full py-2 flex flex-col gap-4 p-2 place-content-between">
        <div className="flex flex-col gap-6">
          <div
            className="cursor-pointer text-neutral-700"
            onClick={() => navigate("dashboard")}
          >
            home
          </div>
          <div
            className="cursor-pointer text-neutral-700"
            onClick={() => navigate("vacation")}
          >
            vacation
          </div>
          <div
            className="cursor-pointer text-neutral-700"
            onClick={() => navigate("members")}
          >
            members
          </div>
          <div
            className="cursor-pointer text-neutral-700"
            onClick={() => navigate("rotations")}
          >
            rotations
          </div>
        </div>
        <div className="flex gap-4 items-center">
          <span className="text-neutral-700">
            <CircleUser />
          </span>
          <button
            className="rounded-md px-4 py-1 bg-blue-700 text-neutral-100"
            onClick={handleLogout}
          >
            log out
          </button>
        </div>
      </div>
    </div>
  );
}
