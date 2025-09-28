import { Link } from "react-router-dom";

export default function RotationsPage() {
  return (
    <>
      <h1>Rotations Page</h1>
      <Link
        to="create"
        className="rounded-md px-4 py-1 bg-blue-700 text-neutral-100"
      >
        Schedule Now
      </Link>
    </>
  );
}
