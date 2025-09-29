import {
  doc,
  getDoc,
  updateDoc,
  runTransaction,
  serverTimestamp,
  Timestamp,
  deleteField,
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

type Assignment = { key: string; name: string; id?: string | null };
type Assignments = Partial<Record<Instrument, Assignment>>;

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

  // Dummy data
  const members = useMemo(
    () => [
      { name: "Shawn", instruments: ["lead", "acoustic", "drums", "bgv"] },
      { name: "Paula", instruments: ["lead", "acoustic", "keys", "bgv"] },
      { name: "Amanda", instruments: ["lead", "acoustic", "keys", "bgv"] },
      { name: "Jeongsoo", instruments: ["lead", "acoustic", "keys", "bgv"] },
      { name: "David Li", instruments: ["keys"] },
      { name: "Chris Bang", instruments: ["lead", "acoustic", "bgv"] },
      { name: "Austin", instruments: ["drums"] },
      { name: "Karino", instruments: ["violin"] },
      { name: "David Leong", instruments: ["electric", "bgv"] },
    ],
    []
  );

  // Load existing rotation when date changes
  useEffect(() => {
    (async () => {
      const snap = await getDoc(doc(db, "rotations", dateKey));
      if (snap.exists()) {
        setMode("edit");
        const a = (snap.data().assignments ?? {}) as Assignments;
        const filled: Record<Instrument, string> = Object.fromEntries(
          INSTRUMENTS.map((r) => [r, a[r]?.name ?? ""])
        ) as any;
        setValues(filled);
      } else {
        setMode("create");
        setValues(Object.fromEntries(INSTRUMENTS.map((r) => [r, ""])) as any);
      }
    })();
  }, [dateKey]);

  // Allowed duplicate combos (same person can do exactly these pairs)
  const ALLOWED_MULTIROLE: ReadonlyArray<ReadonlySet<Instrument>> = [
    new Set(["lead", "acoustic"]),
    new Set(["lead", "keys"]),
  ];

  function validateNoConflicts(assignments: Assignments): string | null {
    const personToRoles = new Map<string, Instrument[]>();
    (Object.entries(assignments) as [Instrument, Assignment][]).forEach(
      ([role, a]) => {
        const arr = personToRoles.get(a.key) ?? [];
        arr.push(role);
        personToRoles.set(a.key, arr);
      }
    );
    const conflicts = [...personToRoles.values()].some((roles) => {
      if (roles.length <= 1) return false;
      const set = new Set(roles);
      return !ALLOWED_MULTIROLE.some(
        (allowed) =>
          allowed.size === set.size && [...allowed].every((r) => set.has(r))
      );
    });
    return conflicts ? "Conflicting assignments found." : null;
  }

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    if (!user?.uid) return alert("You must be signed in.");

    // Build assignment objects
    const assignments: Assignments = {};
    INSTRUMENTS.forEach((role) => {
      const name = values[role]?.trim();
      if (name) assignments[role] = { key: toKey(name), name, id: null };
    });

    const err = validateNoConflicts(assignments);
    if (err) return alert(err);

    setSaving(true);
    try {
      if (mode === "create") {
        // Transaction ensures create-only (fails if doc already exists)
        await runTransaction(db, async (tx) => {
          const ref = doc(db, "rotations", dateKey);
          const snap = await tx.get(ref);
          if (snap.exists())
            throw new Error(`Rotation already exists for ${dateKey}`);
          tx.set(ref, {
            dateKey,
            monthKey: dateKey.slice(0, 7),
            date: Timestamp.fromDate(new Date(`${dateKey}T00:00:00`)),
            assignments,
            createdBy: user.uid,
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
          const name = values[role]?.trim();
          const path = `assignments.${role}`;
          updates[path] = name
            ? { key: toKey(name), name, id: null }
            : deleteField();
        });
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
          className="p-2 rounded-md appearance-none"
          value={values[role]}
          onChange={(ev) =>
            setValues((v) => ({ ...v, [role]: ev.target.value }))
          }
        >
          <option value="">Please Select</option>
          {members
            .filter((m) => m.instruments.includes(role))
            .map((m) => (
              <option key={m.name} value={m.name}>
                {m.name}
              </option>
            ))}
        </select>
      </div>
    );
  }

  return (
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
            className="p-2 rounded-md"
          />
        </div>
        <span className="text-sm text-neutral-600">
          {mode === "create"
            ? "No rotation yet — creating new."
            : "Rotation exists — editing."}
        </span>
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
  );
}
