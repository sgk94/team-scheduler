import {
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
  deleteField,
  query,
  where,
  collection,
  onSnapshot,
} from "firebase/firestore";
import { db } from "../firebase/config";
import { useAuth } from "../context/AuthContext";
import { useEffect, useMemo, useState } from "react";

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

type Assignment = { id: string; key: string; name: string };
type Assignments = Partial<Record<Instrument, Assignment>>;

type Member = {
  uid: string;
  displayName: string;
  instruments: Instrument[];
  active: boolean;
};

const toKey = (s: string) => s.trim().toLowerCase().replace(/\s+/g, "-");
const formatKey = (d: Date) =>
  `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}-${String(
    d.getDate()
  ).padStart(2, "0")}`;
const todayKey = () => formatKey(new Date());
const nextSundayKey = (fromKey: string) => {
  const d = new Date(`${fromKey}T00:00:00`);
  const dow = d.getDay(); // 0..6
  d.setDate(d.getDate() + (dow === 0 ? 7 : 7 - dow)); // strictly following Sunday
  return formatKey(d);
};

type Mode = "create" | "edit";

export default function Scheduler() {
  const { user } = useAuth();
  const [members, setMembers] = useState<Member[]>([]);
  const [mode, setMode] = useState<Mode>("create");
  const [saving, setSaving] = useState(false);
  const [dateKey, setDateKey] = useState(todayKey());
  const [values, setValues] = useState<Record<Instrument, string>>(
    () =>
      Object.fromEntries(INSTRUMENTS.map((r) => [r, ""])) as Record<
        Instrument,
        string
      >
  );

  useEffect(() => {
    const q = query(collection(db, "users"), where("active", "==", true));
    return onSnapshot(q, (snap) => {
      setMembers(
        snap.docs.map((d) => {
          const x = d.data() as any;
          return {
            uid: x.uid ?? d.id,
            displayName: x.displayName ?? x.email ?? "(unknown)",
            instruments: (x.instruments ?? []) as Instrument[],
            active: !!x.active,
          };
        })
      );
    });
  }, []);

  const membersById = useMemo(
    () => new Map(members.map((m) => [m.uid, m])),
    [members]
  );

  // Load existing rotation when date changes
  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "rotations", dateKey));
      if (snap.exists()) {
        const a = (snap.data().assignments ?? {}) as Assignments;
        setMode("edit");
        setValues(
          Object.fromEntries(
            INSTRUMENTS.map((r) => [r, a[r]?.id ?? ""])
          ) as Record<Instrument, string>
        );
      } else {
        setMode("create");
        setValues(
          Object.fromEntries(INSTRUMENTS.map((r) => [r, ""])) as Record<
            Instrument,
            string
          >
        );
      }
    })();
  }, [dateKey]);

  // Allowed duplicate combos (same person can do exactly these pairs)
  const ALLOWED_MULTIROLE: ReadonlyArray<ReadonlySet<Instrument>> = [
    new Set(["lead", "acoustic"]),
    new Set(["lead", "keys"]),
  ];

  function validateNoConflicts(
    assignments: Assignments
  ): string | null | undefined {
    const personToRoles = new Map<string, Instrument[]>();
    (Object.entries(assignments) as [Instrument, Assignment][]).forEach(
      ([role, a]) => {
        (
          personToRoles.get(a.id) ?? personToRoles.set(a.id, []).get(a.id)!
        )?.push(role);
      }
    );

    const conflicts = [...personToRoles.values()].some((roles) => {
      if (roles.length <= 1) return false;
      const s = new Set(roles);
      return !ALLOWED_MULTIROLE.some(
        (allow) => allow.size === s.size && [...allow].every((r) => s.has(r))
      );
    });

    if (conflicts) {
      alert("Conflicting assignments found.");
      return;
    }
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.uid) return alert("You must be signed in.");

    // Build assignment objects
    const assignments: Assignments = {};
    INSTRUMENTS.forEach((role) => {
      const uid = values[role]?.trim();
      if (!uid) return;
      const m = membersById.get(uid);
      const name = m?.displayName ?? "(unknown)";
      assignments[role] = { id: uid, name, key: toKey(name) };
    });

    const assigneeIds = Object.values(assignments).map((a) => a!.id);
    const assigneeKeys = Object.values(assignments).map((a) => a!.key);

    const err = validateNoConflicts(assignments);
    if (err) return alert(err);

    setSaving(true);
    try {
      if (mode === "create") {
        // Transaction ensures create-only (fails if doc already exists)
        await runTransaction(db, async (tx) => {
          const ref = doc(db, "rotations", dateKey);
          if ((await tx.get(ref)).exists())
            throw new Error(`Rotation exists for ${dateKey}`);
          tx.set(ref, {
            dateKey,
            monthKey: dateKey.slice(0, 7),
            date: Timestamp.fromDate(new Date(`${dateKey}T00:00:00`)),
            assignments, // role → {id,name,key}
            assigneeIds, // ["uidA","uidB",...]
            assigneeKeys, // optional
            createdBy: user!.uid,
            createdAt: serverTimestamp(),
            updatedAt: serverTimestamp(),
          });
        });

        // Move to the following Sunday for fast entry
        const nextKey = nextSundayKey(dateKey);
        setDateKey(nextKey);
      } else {
        // Edit: precise updates (set or remove each role)
        const updates: any = { updatedAt: serverTimestamp() };
        INSTRUMENTS.forEach((role) => {
          const uid = values[role]?.trim();
          const m = uid ? membersById.get(uid) : null;
          const path = `assignments.${role}`;
          updates[path] = uid
            ? {
                id: uid,
                name: m?.displayName ?? "(unknown)",
                key: toKey(m?.displayName ?? uid),
              }
            : deleteField();
        });
        updates.assigneeIds = INSTRUMENTS.map((r) => values[r]).filter(Boolean);
        updates.assigneeKeys = (updates.assigneeIds as string[]).map((uid) =>
          toKey(membersById.get(uid)?.displayName ?? uid)
        );

        await updateDoc(doc(db, "rotations", dateKey), updates);
      }
    } catch (e: any) {
      alert(e?.message ?? "Failed to save.");
      console.error(e);
    } finally {
      setSaving(false);
    }
  }

  // Small helper to render each select
  function RoleSelect({ role }: { role: Instrument }) {
    return (
      <div className="flex flex-col gap-2">
        <label className="font-bold capitalize" htmlFor={role}>
          {role}
        </label>
        <select
          id={role}
          name={role}
          className="p-2 rounded-md appearance-none border border-slate-700 bg-neutral-50"
          value={values[role]}
          onChange={(ev) =>
            setValues((v) => ({ ...v, [role]: ev.target.value }))
          }
        >
          <option value="">Please Select</option>
          {members
            .filter((m) => m.instruments.includes(role))
            .map((m) => (
              <option key={m.uid} value={m.uid}>
                {m.displayName}
              </option>
            ))}
        </select>
      </div>
    );
  }

  return (
    <>
      <span className="text-sm text-neutral-600 ml-[32px] mb-2">
        {mode === "create"
          ? "No rotation yet — creating new."
          : "Rotation exists — editing."}
      </span>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-4 flex-1 mr-8 ml-8"
      >
        <div className="flex items-end gap-3">
          <div className="flex flex-col gap-2">
            <label className="font-bold" htmlFor="date">
              Date
            </label>
            <input
              id="date"
              name="date"
              type="date"
              value={dateKey}
              onChange={(e) => setDateKey(e.target.value)}
              min={todayKey()}
              required
              className="p-2 rounded-md border border-slate-700 bg-neutral-50"
            />
          </div>
        </div>

        {INSTRUMENTS.map((role) => (
          <RoleSelect key={role} role={role} />
        ))}

        <button
          disabled={saving}
          className="rounded-md bg-blue-700 text-white px-4 py-2 disabled:opacity-60"
        >
          {saving
            ? "Saving…"
            : mode === "create"
            ? "Create Rotation"
            : "Update Rotation"}
        </button>
      </form>
    </>
  );
}
