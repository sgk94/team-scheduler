import { Link, NavLink } from "react-router-dom";
import { useEffect, useState } from "react";
import {
  collection,
  query,
  where,
  orderBy,
  onSnapshot,
  Timestamp,
} from "firebase/firestore";
import type { DocumentData } from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { ChevronDown } from "lucide-react";

type Rotation = {
  date: any; // Firestore Timestamp
  assignments?: Record<string, { id: string; name: string; key: string }>;
  assigneeIds?: string[];
};

export default function Schedule() {
  const { user } = useAuth();
  const [rotations, setRotations] = useState<(Rotation & { id: string })[]>([]);
  const [error, setError] = useState<Error | null>(null);
  const [openSet, setOpenSet] = useState<Set<string>>(new Set());
  const firstFour = rotations.slice(0, 4);

  useEffect(() => {
    if (!user?.uid) {
      setRotations([]);
      return;
    }

    // Optional: only upcoming
    const nowTs = Timestamp.fromDate(new Date());

    const q = query(
      collection(db, "rotations"),
      where("assigneeIds", "array-contains", user.uid),
      where("date", ">=", nowTs), // remove if you want ALL
      orderBy("date", "asc")
    );

    const unsub = onSnapshot(
      q,
      (snap) => {
        setRotations(
          snap.docs.map((d) => ({
            id: d.id,
            ...(d.data() as DocumentData),
          })) as any
        );
      },
      (err) => setError(err as Error)
    );

    return unsub; // cleanup on unmount/sign-out
  }, [user?.uid]);

  const fmtDate = (ts: any) =>
    ts?.toDate?.().toLocaleDateString(undefined, {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) ?? "";

  const myRoles = (r: Rotation, uid?: string) =>
    Object.entries(r.assignments ?? {})
      .filter(([, a]) => a?.id === uid)
      .map(([role]) => role)
      .join(", ");

  const toggle = (id: string) =>
    setOpenSet((prev) => {
      const next = new Set(prev);
      next.has(id) ? next.delete(id) : next.add(id);
      return next;
    });

  return (
    <>
      <div className="flex flex-row place-content-between items-end mb-3">
        <h1 className="text-neutral-700">
          Hey {user?.displayName ?? "there"}, you're scheduled to serve
        </h1>
        <Link
          to="/schedule/create"
          className="rounded-md px-4 py-1 bg-blue-700 text-neutral-100"
        >
          Schedule Now
        </Link>
      </div>

      {error && <p className="text-red-600">Error: {error.message}</p>}

      <ul className="space-y-2">
        {firstFour.map((rotation) => {
          const isOpen = openSet.has(rotation.id);
          return (
            <li
              key={rotation.id}
              className="rounded-md overflow-hidden border border-neutral-200 bg-white/60"
            >
              <button
                type="button"
                className="w-full text-left p-3 flex items-center justify-between"
                aria-expanded={isOpen}
                aria-controls={`panel-${rotation.id}`}
                id={`acc-${rotation.id}`}
                onClick={() => toggle(rotation.id)}
              >
                <span className="font-medium">
                  {fmtDate(rotation.date)}{" "}
                  {myRoles(rotation, user?.uid) && (
                    <>
                      •{" "}
                      <span className="capitalize">
                        {myRoles(rotation, user?.uid)}
                      </span>
                    </>
                  )}
                </span>
                <ChevronDown
                  className={`transition-transform duration-300 ${
                    isOpen ? "rotate-180" : ""
                  }`}
                />
              </button>

              {/* 👇 No peeking: max-height animation + overflow-hidden */}
              <div
                id={`panel-${rotation.id}`}
                role="region"
                aria-labelledby={`acc-${rotation.id}`}
                className={`overflow-hidden transition-[max-height,opacity] duration-300 ease-in-out ${
                  isOpen ? "max-h-[800px] opacity-100" : "max-h-0 opacity-0"
                }`}
              >
                {/* Use padding here; avoid top margins on first child */}
                <div className="px-3 pb-3 pt-2">
                  {/* panel content */}
                  <div className="text-sm text-neutral-700">David: keys</div>
                  <div className="text-sm text-neutral-700">Chris: BGV</div>
                  <div className="text-sm text-neutral-700">Will: BGV</div>
                  <div className="text-sm text-neutral-700">Karino: Violin</div>
                  <div className="text-sm text-neutral-700">Lucia: Drums</div>
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </>
  );
}
