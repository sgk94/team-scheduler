import { Outlet, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function Navbar() {
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
    <>
      <div className="flex place-content-between border-2 border-neutral-700 px-4 rounded-md mb-4">
        <div className="flex items-center text-neutral-700 text-lg">
          Team Scheduler
        </div>
        <ul className="py-2 flex justify-end gap-4 items-center">
          <li
            className="cursor-pointer text-neutral-700"
            onClick={() => navigate("dashboard")}
          >
            home
          </li>
          <li
            className="cursor-pointer text-neutral-700"
            onClick={() => navigate("vacation")}
          >
            vacation
          </li>
          <li
            className="cursor-pointer text-neutral-700"
            onClick={() => navigate("members")}
          >
            members
          </li>
          <li className="flex gap-2 items-center">
            <span className="text-neutral-700">Welcome {user?.email}</span>
            <button
              className="rounded-md px-4 py-1 bg-blue-700 text-neutral-100"
              onClick={handleLogout}
            >
              log out
            </button>
          </li>
        </ul>
      </div>
    </>
  );
}
