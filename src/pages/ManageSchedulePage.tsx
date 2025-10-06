import { Link } from "react-router-dom";

export default function ManageSchedulePage() {
  return (
    <>
      <h1>Manage Schedule Page</h1>
      <Link
        to="create"
        className="rounded-md px-4 py-1 bg-blue-700 text-neutral-100"
      >
        Schedule Now
      </Link>
    </>
  );
}
