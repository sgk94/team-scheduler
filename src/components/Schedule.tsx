import { Link } from "react-router-dom";
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

type Rotation = {
  date: any; // Firestore Timestamp
  assignments?: Record<string, { id: string; name: string; key: string }>;
  assigneeIds?: string[];
};

export default function Schedule() {
  const { user } = useAuth();
  const [rotations, setRotations] = useState<(Rotation & { id: string })[]>([]);
  const [error, setError] = useState<Error | null>(null);

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

  return (
    <>
      <div className="flex flex-row place-content-between items-end mb-3">
        <h1 className="text-neutral-700">
          Hey {user?.displayName ?? "there"}, you're serving
        </h1>
        <Link
          to="/rotations/create"
          className="rounded-md px-4 py-1 bg-blue-700 text-neutral-100"
        >
          Schedule Now
        </Link>
      </div>

      {error && <p className="text-red-600">Error: {error.message}</p>}

      <ul className="space-y-2">
        {rotations.length === 0 && (
          <li className="text-neutral-500">No upcoming rotations</li>
        )}
        {rotations.map((r) => (
          <li
            key={r.id}
            className="rounded-md bg-white/60 p-3 border border-neutral-200"
          >
            <div className="font-medium">
              {fmtDate(r.date)}{" "}
              {myRoles(r, user?.uid) && (
                <>
                  • <span className="capitalize">{myRoles(r, user?.uid)}</span>
                </>
              )}
            </div>
            <div className="text-sm text-neutral-600">Rotation ID: {r.id}</div>
          </li>
        ))}
      </ul>
    </>
  );
}
