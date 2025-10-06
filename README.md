# Team Scheduler

A lightweight web app to schedule a church worship/praise team: manage members and their instruments, rotate teams (A/B or custom), track vacations/unavailability, and surface conflicts before scheduling.

> Tech: **React + TypeScript + Vite**, **Firebase Auth + Firestore**, **Tailwind CSS** (optionally Zustand for feature state, React Router for navigation).

---

## ✨ Features

* **Members**: roster with name + instruments (lead, acoustic, keys, drums, electric, bgv, violin, …).
* **Scheduling**: create Sunday rotations with per‑instrument assignments; highlight conflicts.
* **Vacations**: track member unavailability; filter schedule UI to avoid overlap.
* **Auth & Roles**: Firebase Auth (Email/Password). Admin role via **Custom Claims** controls writes.
* **Realtime**: Firestore `onSnapshot` updates lists live.

Planned / Roadmap:

* ✅ Dashboard view shows list of upcoming rotations
* ✅ Create and edit rotations
* ✅ Members list sorted by display name
* ➡️ Vacation creation + list (upcoming/past) with a shared panel UI
* ➡️ Conflict detection: block assigning someone who’s on vacation
* ➡️ Team templates (Team A / Team B quick-apply)
* ➡️ Availability calendar view
* ➡️ Notifications (email or SMS) on assignment
* ➡️ Import/export CSV for members

---

## 🧱 Architecture

* **App shell**: providers (Auth), router, layout
* **Feature-first** domain folders (vacation, members, schedule). Pages compose feature components.
* **Data access**: Firestore read/write behind small `api/*` modules.

---

## 🗄️ Data Model (Firestore)

**users** (`users/{uid}`)

* `displayName: string`
* `instruments: string[]` (validated against allowed set)
* `createdAt: Timestamp`

**rotations** (`rotations/{id}`)

* `date: Timestamp`
* `assignments: { [instrument: string]: { id: string; name: string; key: string } }` (example shape)
* `assigneeIds: string[]` (for quick `array-contains` queries)
* `createdBy: string`

**vacations** (`vacations/{id}`)

* `userId: string`
* `start: Timestamp`
* `end: Timestamp`
* `note?: string`
* `createdBy: string`
