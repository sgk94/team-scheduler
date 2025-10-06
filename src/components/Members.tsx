import { useEffect, useState } from "react";
import {
  collection,
  query,
  orderBy,
  onSnapshot,
  type QueryDocumentSnapshot,
  type DocumentData,
} from "firebase/firestore";

import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";

const INSTRUMENTS = [
  "lead",
  "acoustic",
  "keys",
  "drums",
  "electric",
  "bgv",
  "violin",
] as const;
type Instrument = (typeof INSTRUMENTS)[number];

type User = {
  id: string;
  displayName: string;
  instruments: Instrument[];
};

function toUser(doc: QueryDocumentSnapshot<DocumentData>): User {
  const data = doc.data();

  // Coerce instruments into the Instrument union
  const instrumentsRaw: unknown[] = Array.isArray(data.instruments)
    ? data.instruments
    : [];

  const instruments = instrumentsRaw.filter(
    (x): x is Instrument =>
      typeof x === "string" && (INSTRUMENTS as readonly string[]).includes(x)
  );

  return {
    id: doc.id,
    displayName: String(data.displayName ?? ""),
    instruments,
  };
}

export default function Members() {
  const { user } = useAuth();
  const [membersList, setMembersList] = useState<User[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    if (!user?.uid) {
      setMembersList([]);
      setIsLoading(false);
      return;
    }

    const getMembers = query(
      collection(db, "users"),
      orderBy("displayName", "asc")
    );
    const unsubscribe = onSnapshot(
      getMembers,
      (snap) => {
        setMembersList(snap.docs.map(toUser));
        setIsLoading(false);
      },
      (err) => {
        setError(err);
        setIsLoading(false);
      }
    );

    return unsubscribe;
  }, [user?.uid]);

  if (!user?.uid) return <h1>Please sign in to view members</h1>;
  if (isLoading) return <h1>Loading members…</h1>;
  if (error) return <h1>Failed to load members: {error.message}</h1>;

  if (membersList.length === 0) {
    return (
      <section className="p-4 rounded-lg border">
        <h1 className="text-lg font-semibold">No members yet</h1>
        <p className="text-sm mt-1">Add your first member to get started.</p>
        {/* optional CTA */}
        {/* <Link to="/members/new" className="btn mt-3">Add member</Link> */}
      </section>
    );
  }

  return (
    <h1>
      <ul>
        {membersList.map((member) => (
          <li key={member.id}>
            <strong>{member.displayName}</strong>{" "}
            <em>({member.instruments.join(", ") || "—"})</em>
          </li>
        ))}
      </ul>
    </h1>
  );
}
